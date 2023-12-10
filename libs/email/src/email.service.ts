import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Job } from 'src/core/core.job';

@Injectable()
export class EmailService {
  public constructor(private readonly mailerService: MailerService) {}

  async sendMail(job: Job) {
    let error = false,
      data = null;
    try {
      data = await this.mailerService.sendMail(job.payload);
    } catch (err) {
      error = err;
    }
    return { error, data };
  }
}
