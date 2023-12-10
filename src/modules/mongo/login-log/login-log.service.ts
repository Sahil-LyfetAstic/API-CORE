import {
  ModelService,
  MongoCreateResponse,
  MongoJob,
  MongoService,
} from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { LoginLog } from './entities/login-log.entity';

@Injectable()
export class LoginLogService extends ModelService<LoginLog> {
  constructor(db: MongoService<LoginLog>) {
    super(db);
  }

  /**
   * doAfterCreate
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterCreate(
    job: MongoJob<LoginLog>,
    response: MongoCreateResponse<LoginLog>,
  ): Promise<void> {
    await super.doAfterCreate(job, response);
    if (!!response.data.info?.device_token) {
      this.db.updateBulkRecords({
        owner: job.owner,
        body: {
          active: false,
        },
        options: {
          where: {
            active: true,
            'info.device_token': response.data.info?.device_token,
          },
        },
      });
    }
  }
}
