import { Seed } from '@core/sql/seeder/seeder.dto';
import { Country } from '../../modules/sql/country/entities/country.entity';

export default <Seed<Country>>{
  model: 'Country',
  action: 'once',
  data: [
    {
      name: 'United States',
      code: 'US',
    },
  ],
};
