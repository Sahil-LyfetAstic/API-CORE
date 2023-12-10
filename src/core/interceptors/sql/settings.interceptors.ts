import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Op } from 'sequelize';
import { INCLUDE_SETTINGS_KEY } from 'src/core/decorators/sql/settings.decorator';
import { SettingService } from 'src/modules/sql/setting/setting.service';

@Injectable()
export class SettingsInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private settingService: SettingService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const settings = this.reflector.getAllAndOverride<string[]>(
      INCLUDE_SETTINGS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (typeof settings === 'undefined' || !Array.isArray(settings))
      return next.handle();
    const { error, data } = await this.settingService.$db.getAllRecords({
      options: {
        limit: -1,
        where: settings.length > 0 ? { name: { [Op.in]: settings } } : {},
      },
    });
    if (error) throw error;
    request[INCLUDE_SETTINGS_KEY] = data;
    return next.handle();
  }
}
