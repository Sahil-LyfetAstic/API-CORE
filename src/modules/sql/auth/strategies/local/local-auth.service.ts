import { Injectable } from '@nestjs/common';
import { compareHash } from 'src/core/core.utils';
import { User } from '../../../user/entities/user.entity';
import { UserService } from '../../../user/user.service';

export interface AuthResponse {
  error?: any;
  user?: User;
}

@Injectable()
export class LocalAuthService {
  constructor(private _user: UserService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthResponse> {
    const { error, data } = await this._user.$db.findOneRecord({
      options: {
        attributes: { include: ['password'] },
        where: { email: username },
        allowEmpty: true,
      },
    });
    if (!!error) {
      return { error };
    } else if (!!data) {
      if (!(await compareHash(`${password}`, data.getDataValue('password')))) {
        return { error: 'Invalid credentials' };
      }
      if (!data.getDataValue('active')) {
        return { error: 'Account is inactive' };
      }
      data.setDataValue('last_login_at', new Date());
      await data.save();
      const user = data.toJSON();
      delete user.password;
      return { error: false, user };
    } else {
      return { error: 'Invalid credentials' };
    }
  }
}
