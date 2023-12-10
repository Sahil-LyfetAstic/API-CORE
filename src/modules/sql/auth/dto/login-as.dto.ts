import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class LoginAsDto {
  @ApiProperty({
    format: 'int32',
    description: 'User ID',
    example: 1,
  })
  @IsInt()
  user_id: number;
}
