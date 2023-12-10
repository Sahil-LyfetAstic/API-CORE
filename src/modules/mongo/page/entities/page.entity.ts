import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { IsUnique } from '@core/mongo/mongo.unique-validator';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export type PageDocument = MongoDocument<Page>;

@Schema({
  collection: 'page',
  ...defaultSchemaOptions,
})
export class Page extends MongoSchema {
  @Prop({ index: true })
  @ApiProperty({
    description: 'Page Name',
    example: 'about_us',
  })
  @IsString()
  @IsUnique('Page')
  name: string;

  @Prop()
  @ApiProperty({
    description: 'Page Title',
    example: 'About Us',
  })
  @IsString()
  title: string;

  @Prop()
  @ApiProperty({
    description: 'Page Content',
    example: 'About us sample content',
  })
  @IsString()
  content: string;

  @Prop({ default: true })
  @ApiProperty({
    description: 'Allow HTML Content?',
    example: true,
  })
  @IsBoolean()
  allow_html: boolean;
}
export const PageSchema = createMongoSchema(Page);
