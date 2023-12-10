import { Controller } from '@nestjs/common';
import { MsListener } from 'src/core/core.decorators';
import { Job, JobResponse } from 'src/core/core.job';
import { MsClientService } from 'src/core/modules/ms-client/ms-client.service';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for Email
   */
  @MsListener('controller.email')
  async listener(job: Job): Promise<void> {
    const response = await this.emailService[job.action]<JobResponse>(
      new Job(job),
    );
    await this.client.jobDone(job, response);
  }
}
