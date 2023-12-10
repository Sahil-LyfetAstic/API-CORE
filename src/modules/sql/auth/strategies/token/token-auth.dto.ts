import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenAuthDto {
  @ApiProperty({
    description: 'Access Token',
    example: 'token',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Refresh Token',
    example: 'token',
  })
  @IsString()
  refresh_token: string;
}
