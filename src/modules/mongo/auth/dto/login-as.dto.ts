import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class LoginAsDto {
  @ApiProperty({
    description: 'User ID',
    example: '63d11feae5bc1112c08da8f4',
  })
  @IsInt()
  user_id: string;
}
