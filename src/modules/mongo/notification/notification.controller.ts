import { Controller } from '@nestjs/common';
import { MsListener } from 'src/core/core.decorators';
import { Job, JobResponse } from 'src/core/core.job';
import { MsClientService } from 'src/core/modules/ms-client/ms-client.service';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for Notification
   */
  @MsListener('controller.notification')
  async execute(job: Job): Promise<void> {
    const response = await this.notificationService[job.action]<JobResponse>(
      new Job(job),
    );
    await this.client.jobDone(job, response);
  }
}
