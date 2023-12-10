import { MongoDocument } from '@core/mongo';
import { MongoBelongsTo } from '@core/mongo/mongo.decorator';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';
import { Country } from '../../country/entities/country.entity';

export type StateDocument = MongoDocument<State>;

@Schema({
  collection: 'states',
  ...defaultSchemaOptions,
})
export class State extends MongoSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Country' })
  @ApiProperty({
    type: 'string',
    description: 'Country ID',
    example: '60f6c774b735412058402be7',
  })
  @IsMongoId()
  country_id: Types.ObjectId;

  @MongoBelongsTo('Country', 'country_id')
  @ApiProperty({
    description: 'Country',
    type: () => Country,
  })
  country: Country;

  @Prop()
  @ApiProperty({
    description: 'State Name',
    example: 'Alabama',
  })
  @IsString()
  name: string;

  @Prop()
  @ApiProperty({
    description: 'State Code',
    example: 'AL',
  })
  @IsString()
  code: string;
}
export const StateSchema = createMongoSchema(State);
