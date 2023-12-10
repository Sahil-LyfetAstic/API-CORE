import {
  ModelService,
  ModelWrap,
  MongoCreateBulkResponse,
  MongoJob,
  MongoService,
} from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingService extends ModelService<Setting> {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = ['name'];

  /**
   * searchPopulate
   * @property array of associations to include for search
   */

  constructor(db: MongoService<Setting>) {
    super(db);
  }

  /**
   * update bulk
   * @function update array of record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async updateBulk(
    job: MongoJob<Setting>,
  ): Promise<MongoCreateBulkResponse<Setting>> {
    if (!isArray(job.records) || !job.records.length) {
      return { error: 'Records missing' };
    }
    const settings: ModelWrap<Setting>[] = [];
    for (let index = 0; index < job.records.length; index++) {
      const record = job.records[index];
      const response = await this.update({
        owner: job.owner,
        action: 'update',
        id: record.id,
        body: record,
        options: {
          fields: ['value'],
        },
      });
      settings.push(response.data);
    }
    return { data: settings };
  }
}
