import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(User, ['role', 'password'] as const),
) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar File',
  })
  avatar_file?: any;
}
