import { ModelService, MongoService } from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService extends ModelService<History> {
  constructor(db: MongoService<History>) {
    super(db);
  }
}
