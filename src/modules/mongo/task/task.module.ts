import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { isPrimaryInstance } from 'src/core/core.utils';
import { MongoModule } from '../../../../libs/mongo/src';
import { HistoryModule } from './../history/history.module';
import { TrashModule } from './../trash/trash.module';
import { HistoryCron } from './crons/history.cron';
import { TrashCron } from './crons/trash.cron';
import { Task, TaskSchema } from './entities/task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HistoryModule,
    TrashModule,
    MongoModule.register({ name: Task.name, schema: TaskSchema }),
  ],
  providers: [TaskService, HistoryCron, TrashCron],
})
export class TaskModule implements OnApplicationBootstrap {
  constructor(private taskService: TaskService) {}
  async onApplicationBootstrap() {
    if (isPrimaryInstance()) {
      await this.taskService.initCrons();
    }
  }
}
