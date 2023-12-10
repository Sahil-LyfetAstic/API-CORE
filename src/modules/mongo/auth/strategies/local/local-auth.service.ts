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
        projection: '+password',
        where: { email: username },
        allowEmpty: true,
      },
    });
    if (!!error) {
      return { error };
    } else if (!!data) {
      if (!(await compareHash(`${password}`, data.password))) {
        return { error: 'Invalid credentials' };
      }
      if (!data.active) {
        return { error: 'Account is inactive' };
      }
      data.last_login_at = new Date();
      await data.save();
      return { error: false, user: data };
    } else {
      return { error: 'Invalid credentials' };
    }
  }
}
