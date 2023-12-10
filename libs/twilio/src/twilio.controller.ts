import { Controller } from '@nestjs/common';
import { MsListener } from 'src/core/core.decorators';
import { Job, JobResponse } from 'src/core/core.job';
import { MsClientService } from 'src/core/modules/ms-client/ms-client.service';
import { TwilioService } from './twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(
    private readonly twilioService: TwilioService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for Twilio
   */
  @MsListener('controller.twilio')
  async execute(job: Job): Promise<void> {
    const response = await this.twilioService[job.action]<JobResponse>(
      new Job(job),
    );
    await this.client.jobDone(job, response);
  }
}
