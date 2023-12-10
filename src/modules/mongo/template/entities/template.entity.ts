import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { IsUnique } from '@core/mongo/mongo.unique-validator';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export type TemplateDocument = MongoDocument<Template>;

@Schema({
  collection: 'template',
  ...defaultSchemaOptions,
})
export class Template extends MongoSchema {
  @Prop({ index: true })
  @ApiProperty({
    description: 'Template Name',
    example: 'new_account',
  })
  @IsString()
  @IsUnique('Template')
  name: string;

  @Prop()
  @ApiProperty({
    description: 'Template Title',
    example: 'New Account',
  })
  @IsString()
  title: string;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Send Email?',
    example: true,
  })
  @IsBoolean()
  send_email: boolean;

  @Prop()
  @ApiProperty({
    description: 'Email Subject',
    example: 'New account created',
  })
  @IsString()
  email_subject: string;

  @Prop()
  @ApiProperty({
    description: 'Email Body',
    example: '<p>HTML content</p>',
  })
  @IsString()
  email_body: string;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Send SMS?',
    example: true,
  })
  @IsBoolean()
  send_sms: boolean;

  @Prop()
  @ApiProperty({
    description: 'SMS Body',
    example: 'SMS content',
  })
  @IsString()
  sms_body: string;
}
export const TemplateSchema = createMongoSchema(Template);
