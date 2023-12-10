import { Seed } from '@core/mongo/seeder/seeder.dto';
import { User } from '../../modules/mongo/user/entities/user.entity';

export default <Seed<Omit<User, 'role'>>>{
  model: 'User',
  action: 'once',
  data: [
    {
      role: 'Admin',
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@admin.com',
      phone_code: '+1',
      phone: '9999999999',
      password: '123456',
    },
    {
      role: 'User',
      first_name: 'Test',
      last_name: 'User',
      email: 'user@user.com',
      phone_code: '+1',
      phone: '9999999998',
      password: '123456',
    },
  ],
};
