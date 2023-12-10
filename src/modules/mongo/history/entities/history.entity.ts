import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export type HistoryDocument = MongoDocument<History>;

@Schema({
  collection: 'histories',
  ...defaultSchemaOptions,
})
export class History extends MongoSchema {
  @Prop()
  @ApiProperty({
    description: 'Entity Name',
    example: 'User',
  })
  entity: string;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    description: 'Entity ID',
    example: 1,
  })
  entity_id: number | Types.ObjectId;

  @Prop()
  @ApiProperty({
    description: 'Action',
    example: 1,
  })
  action: string;

  @Prop({
    default: false,
  })
  @ApiProperty({
    description: 'Is New Record?',
    example: true,
  })
  created: boolean;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    type: {},
    description: 'New Details',
  })
  data: any;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    type: {},
    description: 'Previous Details',
  })
  previous_data: any;

  @Prop({ type: 'date' })
  @ApiProperty({
    format: 'date-time',
    description: 'Expire Date',
    example: '2021-01-01T00:00:00Z',
  })
  expire_in: Date;
}

export const HistorySchema = createMongoSchema(History);
