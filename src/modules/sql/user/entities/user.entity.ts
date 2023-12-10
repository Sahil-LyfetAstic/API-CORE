import { SqlModel } from '@core/sql/sql.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  BeforeCreate,
  BeforeSave,
  Column,
  DataType,
  DefaultScope,
  Table,
} from 'sequelize-typescript';
import config from 'src/config';
import { generateHash, uuid } from 'src/core/core.utils';
import { AuthProvider } from '../../auth/auth-provider.enum';
import { Role } from '../role.enum';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Table
export class User extends SqlModel {
  @Column({
    type: DataType.ENUM(...Object.keys(Role)),
    defaultValue: Role.User,
  })
  @ApiProperty({
    enum: Role,
    description: 'Role',
    example: Role.User,
  })
  @IsEnum(Role)
  role: Role;

  @Column({ unique: 'uid' })
  @ApiProperty({
    description: 'Unique ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  uid: string;

  @Column({
    type: DataType.ENUM(...Object.keys(AuthProvider)),
    defaultValue: 'Local',
  })
  @ApiProperty({
    enum: AuthProvider,
    description: 'Auth Provider',
    example: 'Local',
    readOnly: true,
  })
  provider: AuthProvider;

  @Column
  @ApiProperty({
    description: 'Google ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  google_id?: string;

  @Column
  @ApiProperty({
    description: 'Facebook ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  facebook_id?: string;

  @Column
  @ApiProperty({
    description: 'Firebase ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  firebase_id?: string;

  @Column
  @ApiProperty({
    description: 'Apple ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  apple_id?: string;

  @Column
  @ApiProperty({
    description: 'First Name',
    example: 'Ross',
  })
  @IsString()
  first_name: string;

  @Column
  @ApiProperty({
    description: 'Last Name',
    example: 'Geller',
  })
  @IsString()
  last_name: string;

  @Column
  @ApiProperty({
    description: 'Full Name',
    example: 'Ross Geller',
    readOnly: true,
  })
  name?: string;

  @Column
  @ApiProperty({
    description: 'Email',
    example: 'ross.geller@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column({ type: DataType.STRING(7), defaultValue: '+1' })
  @ApiProperty({
    description: 'Phone Code',
    example: '+91',
  })
  @IsString()
  phone_code: string;

  @Column(DataType.STRING(20))
  @ApiProperty({
    description: 'Phone',
    example: '9999999999',
  })
  @IsNumberString()
  phone: string;

  @Column
  @ApiProperty({
    description: 'Password',
    example: '123456',
    writeOnly: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @Column
  @ApiProperty({
    description: 'Avatar',
    example: 'user/avatar.png',
  })
  @IsOptional()
  @IsString()
  get avatar(): string {
    return this.getDataValue('avatar')
      ? config().cdnURL + this.getDataValue('avatar')
      : null;
  }

  set avatar(v: string) {
    this.setDataValue(
      'avatar',
      typeof v === 'string' ? v.replace(config().cdnURL, '') : null,
    );
  }

  @Column({ defaultValue: false })
  @ApiProperty({
    description: 'Enable 2FA?',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enable_2fa?: boolean;

  @Column({ defaultValue: true })
  @ApiProperty({
    description: 'Send Email?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  send_email?: boolean;

  @Column({ defaultValue: true })
  @ApiProperty({
    description: 'Send SMS?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  send_sms?: boolean;

  @Column({ defaultValue: true })
  @ApiProperty({
    description: 'Send Push?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  send_push?: boolean;

  @Column
  @ApiProperty({
    format: 'date-time',
    description: 'Last Login At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  last_login_at?: Date;

  @BeforeSave
  static setName(instance: User) {
    if (instance.first_name && instance.last_name) {
      instance.name = `${instance.first_name} ${instance.last_name}`;
    }
  }

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.password) {
      instance.password = await generateHash(instance.password);
    }
  }

  @BeforeCreate
  static setUuid(instance: User) {
    instance.uid = uuid();
  }
}
