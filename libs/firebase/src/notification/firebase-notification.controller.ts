import { Controller } from '@nestjs/common';
import { MsListener } from 'src/core/core.decorators';
import { Job, JobResponse } from 'src/core/core.job';
import { MsClientService } from 'src/core/modules/ms-client/ms-client.service';
import { FirebaseNotificationService } from './firebase-notification.service';

@Controller('firebase-notification')
export class FirebaseNotificationController {
  constructor(
    private readonly firebaseNotificationService: FirebaseNotificationService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for FirebaseNotification
   */
  @MsListener('controller.firebase-notification')
  async execute(job: Job): Promise<void> {
    const response = await this.firebaseNotificationService[
      job.action
    ]<JobResponse>(new Job(job));
    await this.client.jobDone(job, response);
  }
}
