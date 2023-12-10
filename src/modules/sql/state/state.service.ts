import { ModelService, SqlService } from '@core/sql';
import { Injectable } from '@nestjs/common';
import { State } from './entities/state.entity';

@Injectable()
export class StateService extends ModelService<State> {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = ['name', '$country.name$'];

  /**
   * searchPopulate
   * @property array of associations to include for search
   */
  searchPopulate: string[] = ['country'];

  constructor(db: SqlService<State>) {
    super(db);
  }
}
