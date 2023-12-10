import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Session ID',
    example: '60659e99e61b6b3bbc7b5051',
  })
  @IsString()
  session_id: string;
}
