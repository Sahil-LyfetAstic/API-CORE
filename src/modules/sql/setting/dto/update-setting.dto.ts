import { PickType } from '@nestjs/swagger';
import { Setting } from '../entities/setting.entity';

export class UpdateSettingDto extends PickType(Setting, ['value'] as const) {}
