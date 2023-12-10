import { Seed } from '@core/mongo/seeder/seeder.dto';
import { Country } from '../../modules/mongo/country/entities/country.entity';

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
