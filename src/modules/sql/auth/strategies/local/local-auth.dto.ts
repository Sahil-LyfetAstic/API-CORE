import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator';

export class LocalAuthDto {
  @ApiProperty({
    description: 'Username',
    example: 'admin@admin.com',
  })
  @IsString()
  @IsEmail()
  username: string;

  @ApiProperty({
    description: 'Passsword',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Additional session info',
    default: {},
  })
  @IsOptional()
  info: any;
}
