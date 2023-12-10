import {
  ModelService,
  ModelWrap,
  MongoCreateResponse,
  MongoDeleteResponse,
  MongoJob,
  MongoService,
  MongoUpdateResponse,
} from '@core/mongo';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TaskService extends ModelService<Task> {
  private logger: Logger = new Logger('TaskSchedule');

  constructor(
    protected db: MongoService<Task>,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    super(db);
  }

  /**
   * doAfterCreate
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterCreate(
    job: MongoJob<Task>,
    response: MongoCreateResponse<Task>,
  ): Promise<void> {
    await super.doAfterCreate(job, response);
    await this.createCron(response.data);
  }

  /**
   * doAfterUpdate
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterUpdate(
    job: MongoJob<Task>,
    response: MongoUpdateResponse<Task>,
  ): Promise<void> {
    await super.doAfterUpdate(job, response);
    this.schedulerRegistry.deleteCronJob(`${job.id}`);
    this.logger.warn(`Task deleted`);
    await this.createCron(response.data);
  }

  /**
   * doAfterDelete
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterDelete(
    job: MongoJob<Task>,
    response: MongoDeleteResponse<Task>,
  ): Promise<void> {
    await super.doAfterDelete(job, response);
    this.schedulerRegistry.deleteCronJob(`${job.id}`);
    this.logger.warn(`Task deleted`);
  }

  async initCrons(): Promise<void> {
    this.logger.log('Fetching schedules');
    const { error, data } = await this.db.getAllRecords({
      options: {
        where: {
          status: TaskStatus.Pending,
        },
        limit: -1,
        pagination: false,
      },
    });

    if (error) {
      this.logger.error('Error! Unable to fetch schedules!');
      return;
    }

    if (!data.length) {
      this.logger.log('No schedules found!');
      return;
    }

    this.logger.log('Scheduling tasks');

    for (let index = 0; index < data.length; index++) {
      const task = data[index];
      await this.createCron(task);
    }

    this.logger.log('Task scheduled');
  }

  async createCron(task: ModelWrap<Task>) {
    switch (task.name) {
      // Sample cron category
      case 'test':
        try {
          const job = new CronJob({
            cronTime: task.scheduled_time,
            onTick: () => {
              this.logger.log('Task running');
              // Write your code here and save the result in task.result
              // task.result = { status: true };
              job.stop();
            },
            onComplete: async () => {
              await this.markAsCompleted(task);
            },
          });
          this.schedulerRegistry.addCronJob(task._id.toString(), job);
          job.start();
        } catch (error) {
          this.markAsErrored(task, error);
        }
        break;

      default:
        break;
    }
  }

  async markAsCompleted(task: ModelWrap<Task>) {
    try {
      task.error = false;
      task.status = TaskStatus.Completed;
      await task.save();
      this.logger.log('Task completed');
    } catch (error) {}
  }

  async markAsErrored(task: ModelWrap<Task>, error: any) {
    try {
      task.error = error;
      task.status = TaskStatus.Errored;
      await task.save();
      this.logger.log('Task failed!');
    } catch (error) {}
  }
}
