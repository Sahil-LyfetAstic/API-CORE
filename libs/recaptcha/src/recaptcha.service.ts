import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Job } from 'src/core/core.job';

const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';

@Injectable()
export class RecaptchaService {
  constructor(private readonly configService: ConfigService) {}

  async verify(job: Job) {
    let error = false,
      data = null;

    try {
      const secret = this.configService.get('recaptcha').secret;
      const response = await axios.post(
        `${recaptchaURL}?secret=${secret}&response=${job.payload.response}&remoteip=${job.payload.remoteip}`,
      );
      data = response.data;
    } catch (err) {
      error = err;
    }
    return { error, data };
  }
}
