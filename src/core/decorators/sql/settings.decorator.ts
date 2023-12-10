import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Setting } from 'src/modules/sql/setting/entities/setting.entity';

export const INCLUDE_SETTINGS_KEY = 'include_settings';

/**
 * Decorator for including settings in request
 *
 *```js
 * @IncludeSettings()
 * ```
 * OR
 * ```js
 * @IncludeSettings('setting_1')
 * ```
 */
export const IncludeSettings = (...settings: string[]) =>
  SetMetadata(INCLUDE_SETTINGS_KEY, settings);

/**
 * Decorator for fetching settings from Request object
 *
 * settings array will be available for controller's methods as a parameter
 *```js
 * @Settings() settings: Setting[]
 * ```
 * OR
 * ```js
 * @Settings('setting_1') setting: Setting
 * ```
 * @return {object} settings - req.settings object
 */
export const Settings = createParamDecorator(
  (key: string, ctx: ExecutionContext): Setting | Setting[] => {
    const request = ctx.switchToHttp().getRequest();
    const settings: Setting[] = request[INCLUDE_SETTINGS_KEY] || [];
    if (!!key) return settings.find((x: Setting) => x.name === key);
    else return settings;
  },
);

/**
 * Decorator for fetching setting value from Request object
 *
 * setting value will be available for controller's methods as a parameter
 *```js
 * @SettingValue('setting_1') setting_1: any
 * ```
 * @return {any} setting value
 */
export const SettingValue = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const settings: Setting[] = request[INCLUDE_SETTINGS_KEY] || [];
    if (!!key)
      return settings.find((x: Setting) => x.name === key)?.value || null;
    else return null;
  },
);
