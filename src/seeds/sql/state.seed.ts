import { Seed, SeedReference } from '@core/sql/seeder/seeder.dto';
import { State } from '../../modules/sql/state/entities/state.entity';

export default <Seed<Omit<State, 'country_id'>>>{
  model: 'State',
  action: 'once',
  data: [
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Alabama',
      code: 'AL',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Alaska',
      code: 'AK',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Arizona',
      code: 'AZ',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Arkansas',
      code: 'AR',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'California',
      code: 'CA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Colorado',
      code: 'CO',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Connecticut',
      code: 'CT',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Delaware',
      code: 'DE',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Florida',
      code: 'FL',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Georgia',
      code: 'GA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Hawaii',
      code: 'HI',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Idaho',
      code: 'ID',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Illinois',
      code: 'IL',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Indiana',
      code: 'IN',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Iowa',
      code: 'IA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Kansas',
      code: 'KS',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Kentucky',
      code: 'KY',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Louisiana',
      code: 'LA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Maine',
      code: 'ME',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Maryland',
      code: 'MD',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Massachusetts',
      code: 'MA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Michigan',
      code: 'MI',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Minnesota',
      code: 'MN',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Mississippi',
      code: 'MS',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Missouri',
      code: 'MO',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Montana',
      code: 'MT',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Nebraska',
      code: 'NE',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Nevada',
      code: 'NV',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'New Hampshire',
      code: 'NH',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'New Jersey',
      code: 'NJ',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'New Mexico',
      code: 'NM',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'New York',
      code: 'NY',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'North Carolina',
      code: 'NC',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'North Dakota',
      code: 'ND',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Ohio',
      code: 'OH',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Oklahoma',
      code: 'OK',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Oregon',
      code: 'OR',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Pennsylvania',
      code: 'PA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Rhode Island',
      code: 'RI',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'South Carolina',
      code: 'SC',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'South Dakota',
      code: 'SD',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Tennessee',
      code: 'TN',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Texas',
      code: 'TX',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Utah',
      code: 'UT',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Vermont',
      code: 'VT',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Virginia',
      code: 'VA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Washington',
      code: 'WA',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'West Virginia',
      code: 'WV',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Wisconsin',
      code: 'WI',
    },
    {
      country_id: new SeedReference({
        model: 'Country',
        where: {
          name: 'United States',
        },
      }),
      name: 'Wyoming',
      code: 'WY',
    },
  ],
};
