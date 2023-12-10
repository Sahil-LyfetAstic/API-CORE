import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: 'Session ID',
    example: '63d11feae5bc1112c08da8f4',
    required: false,
  })
  @IsOptional()
  session_id: string;
}
