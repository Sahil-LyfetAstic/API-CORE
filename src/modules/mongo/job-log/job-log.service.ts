import { ModelService, MongoService } from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { JobLog } from './entities/job-log.entity';

@Injectable()
export class JobLogService extends ModelService<JobLog> {
  constructor(db: MongoService<JobLog>) {
    super(db);
  }
}
