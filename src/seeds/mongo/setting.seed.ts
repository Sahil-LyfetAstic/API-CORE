import { Seed } from '@core/mongo/seeder/seeder.dto';
import { Setting } from '../../modules/mongo/setting/entities/setting.entity';

export default <Seed<Setting>>{
  model: 'Setting',
  action: 'once',
  data: [
    {
      name: 'setting_1',
      display_name: 'Setting 1',
      value: 'value 1',
      group_id: 1,
    },
    {
      name: 'setting_2',
      display_name: 'Setting 2',
      value: 'value 2',
      group_id: 1,
      option: {
        type: 'number',
        format: 'amount',
        required: false,
        min: 0,
      },
    },
  ],
};
