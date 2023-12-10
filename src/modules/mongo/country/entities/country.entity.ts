import { MongoDocument } from '@core/mongo';
import { MongoHasMany } from '@core/mongo/mongo.decorator';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { State } from '../../state/entities/state.entity';

export type CountryDocument = MongoDocument<Country>;

@Schema({
  collection: 'country',
  ...defaultSchemaOptions,
})
export class Country extends MongoSchema {
  @Prop()
  @ApiProperty({
    description: 'Country Name',
    example: 'United States',
  })
  @IsString()
  name: string;

  @Prop()
  @ApiProperty({
    description: 'Country Code',
    example: 'US',
  })
  @IsString()
  code: string;

  @MongoHasMany('State', 'country_id')
  @ApiProperty({
    description: 'States',
    type: 'array',
    items: {
      $ref: getSchemaPath(State),
    },
  })
  states: State[];
}
export const CountrySchema = createMongoSchema(Country);
