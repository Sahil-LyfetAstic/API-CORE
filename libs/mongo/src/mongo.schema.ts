import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { FilterQuery, SchemaOptions, SchemaTypes, Types } from 'mongoose';
import { AppEngine, defaultEngine } from 'src/app.config';

export interface DeleteOptions {
  force?: boolean;
  deletedBy?: number | Types.ObjectId;
}

export interface RestoreOptions {
  restoredBy?: number | Types.ObjectId;
}

export interface DefaultSchemaMethods {
  delete(options?: DeleteOptions): Promise<this>;
  restore(options?: RestoreOptions): Promise<this>;
}

export interface DefaultSchemaStaticMethods<T> {
  bulkDelete(filter?: FilterQuery<T>, options?: DeleteOptions): Promise<any>;
}

export const defaultSchemaOptions: SchemaOptions = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    virtuals: true,
    transform(_doc, _ret) {
      delete _ret._id;
      delete _ret.__v;
      delete _ret.deletedAt;
      delete _ret.deletedBy;
      return _ret;
    },
  },
  toObject: {
    virtuals: true,
  },
};

export class MongoSchema {
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'ID as String',
    readOnly: true,
  })
  id: string;

  @Prop({
    default: true,
  })
  @ApiProperty({
    description: 'Is Active?',
    example: true,
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty({
    format: 'date-time',
    description: 'Created At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  created_at: Date;

  @Prop({
    type: defaultEngine === AppEngine.Mongo ? SchemaTypes.ObjectId : Number,
    default: null,
  })
  @ApiProperty({
    description: 'Created By',
    example: '606d990740d3ba3480dae119',
    readOnly: true,
  })
  created_by: number | string;

  @ApiProperty({
    format: 'date-time',
    description: 'Updated At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  updated_at: Date;

  @Prop({
    type: defaultEngine === AppEngine.Mongo ? SchemaTypes.ObjectId : Number,
    default: null,
  })
  @ApiProperty({
    description: 'Updated By',
    example: '606d990740d3ba3480dae119',
    readOnly: true,
  })
  updated_by: number | Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  deleted: boolean;

  @Prop()
  deleted_at: Date;

  @Prop({
    type: defaultEngine === AppEngine.Mongo ? SchemaTypes.ObjectId : Number,
  })
  deleted_by: number | Types.ObjectId;
}
