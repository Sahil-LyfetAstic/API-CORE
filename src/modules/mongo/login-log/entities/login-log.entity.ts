import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type LoginLogDocument = MongoDocument<LoginLog>;

@Schema({
  collection: 'login_logs',
  ...defaultSchemaOptions,
})
export class LoginLog extends MongoSchema {
  @Prop({ type: 'Mixed' })
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  user_id: any;

  @Prop()
  @ApiProperty({
    description: 'Refresh Token',
    example: 'e9e93e0a5acfb6358c7c9fd91579b048d40574a',
  })
  token: string;

  @Prop()
  @ApiProperty({
    format: 'date-time',
    description: 'Token Expiry',
    example: '2021-01-01T00:00:00Z',
  })
  token_expiry: Date;

  @Prop({
    default: Date.now,
  })
  @ApiProperty({
    format: 'date-time',
    description: 'Login At',
    example: '2021-01-01T00:00:00Z',
  })
  login_at: Date;

  @Prop()
  @ApiProperty({
    format: 'date-time',
    description: 'Logout At',
    example: '2021-01-01T00:00:00Z',
  })
  logout_at: Date;

  @Prop({
    default: true,
  })
  @ApiProperty({
    description: 'Is Active?',
    example: false,
  })
  active: boolean;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    type: {},
    description: 'Info',
  })
  info: any;
}

export const LoginLogSchema = createMongoSchema(LoginLog);
