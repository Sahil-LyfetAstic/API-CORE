import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { IsUnique } from '@core/mongo/mongo.unique-validator';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Document } from 'mongoose';

export type SettingDocument = MongoDocument<Setting>;

@Schema({ _id: false })
export class Options extends Document {
  @Prop()
  @ApiProperty({
    description: 'type',
    example: 'text',
  })
  @IsString()
  type: string;

  @Prop()
  @ApiProperty({
    description: 'required?',
    example: true,
  })
  @IsBoolean()
  required: boolean;
}

export const OptionsSchema = SchemaFactory.createForClass(Options);

@Schema({
  collection: 'settings',
  ...defaultSchemaOptions,
})
export class Setting extends MongoSchema {
  @Prop({ index: true })
  @ApiProperty({
    description: 'Setting Name',
    example: 'timezone',
  })
  @IsString()
  @IsUnique('Setting')
  name: string;

  @Prop()
  @ApiProperty({
    description: 'Setting Display Name',
    example: 'System Timezone',
  })
  @IsString()
  display_name: string;

  @Prop()
  @ApiProperty({
    description: 'Setting Value',
    example: 'America/New_York',
  })
  @IsString()
  value: string;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Editable?',
    example: true,
  })
  @IsBoolean()
  editable: boolean;

  @Prop({ default: 1 })
  @ApiProperty({
    description: 'Group ID',
    example: 1,
  })
  @IsInt()
  group_id: number;

  @Prop({ default: 0 })
  @ApiProperty({
    description: 'Sort Order',
    example: 1,
  })
  @IsInt()
  sort_no: number;

  @Prop({ type: [OptionsSchema], default: [{ type: 'text', required: true }] })
  @ApiProperty({
    description: 'Options',
    type: () => [Options],
  })
  @IsOptional()
  @IsArray()
  options: Options[];
}

export const SettingSchema = createMongoSchema(Setting);
