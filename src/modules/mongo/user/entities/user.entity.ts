import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
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
import { AuthProvider } from '../../auth/auth-provider.enum';
import { Role } from '../role.enum';

export type UserDocument = MongoDocument<User>;

@Schema({
  collection: 'users',
  ...defaultSchemaOptions,
  toJSON: {
    virtuals: true,
    transform(_doc, _ret) {
      delete _ret._id;
      delete _ret.__v;
      delete _ret.deletedAt;
      delete _ret.deletedBy;
      delete _ret.password;
      return _ret;
    },
  },
})
export class User extends MongoSchema {
  @Prop({
    type: String,
    enum: Object.values(Role),
    default: Role.User,
  })
  @ApiProperty({
    enum: Role,
    description: 'Role',
    example: Role.User,
  })
  @IsEnum(Role)
  role: Role;

  @Prop({ unique: true })
  @ApiProperty({
    description: 'Unique ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  uid: string;

  @Prop({
    type: String,
    enum: Object.values(AuthProvider),
    default: 'Local',
  })
  @ApiProperty({
    enum: AuthProvider,
    description: 'Auth Provider',
    example: 'Local',
    readOnly: true,
  })
  provider: AuthProvider;

  @Prop()
  @ApiProperty({
    description: 'Google ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  google_id?: string;

  @Prop()
  @ApiProperty({
    description: 'Facebook ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  facebook_id?: string;

  @Prop()
  @ApiProperty({
    description: 'Firebase ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  firebase_id?: string;

  @Prop()
  @ApiProperty({
    description: 'Apple ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  apple_id?: string;

  @Prop()
  @ApiProperty({
    description: 'First Name',
    example: 'Ross',
  })
  @IsString()
  first_name: string;

  @Prop()
  @ApiProperty({
    description: 'Last Name',
    example: 'Geller',
  })
  @IsString()
  last_name: string;

  @Prop()
  @ApiProperty({
    description: 'Full Name',
    example: 'Ross Geller',
    readOnly: true,
  })
  name?: string;

  @Prop()
  @ApiProperty({
    description: 'Email',
    example: 'ross.geller@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @Prop({ type: String, default: '+1' })
  @ApiProperty({
    description: 'Phone Code',
    example: '+91',
  })
  @IsString()
  phone_code: string;

  @Prop({ type: String })
  @ApiProperty({
    description: 'Phone',
    example: '9999999999',
  })
  @IsNumberString()
  phone: string;

  @Prop({ select: false })
  @ApiProperty({
    description: 'Password',
    example: '123456',
    writeOnly: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @Prop()
  @ApiProperty({
    description: 'Avatar',
    example: 'user/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @Prop({ default: false })
  @ApiProperty({
    description: 'Enable 2FA?',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enable_2fa?: boolean;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Send Email?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  send_email?: boolean;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Send SMS?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  send_sms?: boolean;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Send Push?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  send_push?: boolean;

  @Prop()
  @ApiProperty({
    format: 'date-time',
    description: 'Last Login At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  last_login_at?: Date;
}
export const UserSchema = createMongoSchema(User);
