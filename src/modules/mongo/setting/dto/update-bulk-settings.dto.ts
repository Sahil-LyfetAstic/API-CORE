import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Setting } from '../entities/setting.entity';

export class UpdateBulkSettingDto extends PickType(Setting, [
  'value',
] as const) {
  @ApiProperty({
    format: 'int32',
    description: 'Setting Id',
    example: 1,
  })
  @IsNumber()
  id: number;
}
