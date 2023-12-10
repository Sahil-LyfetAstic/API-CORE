import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { LoginLog, LoginLogSchema } from './entities/login-log.entity';
import { LoginLogService } from './login-log.service';

@Module({
  imports: [
    MongoModule.register({ name: LoginLog.name, schema: LoginLogSchema }),
  ],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
