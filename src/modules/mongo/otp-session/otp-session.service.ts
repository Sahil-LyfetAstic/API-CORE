import { ModelService, MongoService } from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { OtpSession } from './entities/otp-session.entity';

@Injectable()
export class OtpSessionService extends ModelService<OtpSession> {
  constructor(db: MongoService<OtpSession>) {
    super(db);
  }
}
