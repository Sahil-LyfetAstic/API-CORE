import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class ChangePasswordDto extends PickType(User, ['password'] as const) {
  @ApiProperty({
    description: 'Old Password',
    example: '123456',
    writeOnly: true,
  })
  @IsString()
  @MinLength(6)
  old_password: string;
}
