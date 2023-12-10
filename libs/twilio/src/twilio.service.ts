import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, JobResponse } from 'src/core/core.job';
import { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class TwilioService {
  public twilio: Twilio;
  public constructor(private _config: ConfigService) {
    this.twilio = new Twilio(
      this._config.get('twilio').accountSid,
      this._config.get('twilio').authToken,
    );
  }

  async sendSMS(job: Job): Promise<JobResponse<MessageInstance>> {
    try {
      const data = await this.twilio.messages.create({
        from: this._config.get('twilio')?.from,
        body: job.payload.body,
        to: job.payload.to,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
