import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { OtpSession, OtpSessionSchema } from './entities/otp-session.entity';
import { OtpSessionService } from './otp-session.service';

@Module({
  imports: [
    MongoModule.register({ name: OtpSession.name, schema: OtpSessionSchema }),
  ],
  providers: [OtpSessionService],
  exports: [OtpSessionService],
})
export class OtpSessionModule {}
