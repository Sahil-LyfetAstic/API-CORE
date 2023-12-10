import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: 'Session ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  session_id: string;
}
