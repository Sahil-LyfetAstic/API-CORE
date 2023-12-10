import { ModelService, MongoService } from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplateService extends ModelService<Template> {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = ['name', 'title'];

  constructor(db: MongoService<Template>) {
    super(db);
  }
}
