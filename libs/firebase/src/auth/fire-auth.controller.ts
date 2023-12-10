import { Controller } from '@nestjs/common';
import { MsListener } from 'src/core/core.decorators';
import { Job, JobResponse } from 'src/core/core.job';
import { MsClientService } from 'src/core/modules/ms-client/ms-client.service';
import { FireAuthService } from './fire-auth.service';

@Controller('fire-auth')
export class FireAuthController {
  constructor(
    private readonly fireAuthService: FireAuthService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for FireAuth
   */
  @MsListener('controller.fire-auth')
  async execute(job: Job): Promise<void> {
    const response = await this.fireAuthService[job.action]<JobResponse>(
      new Job(job),
    );
    await this.client.jobDone(job, response);
  }
}
