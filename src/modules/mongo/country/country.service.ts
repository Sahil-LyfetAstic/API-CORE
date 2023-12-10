import { ModelService, MongoService } from '@core/mongo';
import { Injectable } from '@nestjs/common';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService extends ModelService<Country> {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = ['name'];

  constructor(db: MongoService<Country>) {
    super(db);
  }
}
