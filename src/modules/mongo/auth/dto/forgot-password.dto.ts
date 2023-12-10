import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email',
    example: 'admin@admin.com',
  })
  @IsEmail()
  email: string;
}
