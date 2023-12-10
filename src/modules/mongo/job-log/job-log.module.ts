import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { JobLog, JobLogSchema } from './entities/job-log.entity';
import { JobLogService } from './job-log.service';

@Module({
  imports: [MongoModule.register({ name: JobLog.name, schema: JobLogSchema })],
  providers: [JobLogService],
  exports: [JobLogService],
})
export class JobLogModule {}
