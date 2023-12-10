import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';

export enum TaskStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Errored = 'Errored',
}

export type TaskDocument = MongoDocument<Task>;

@Schema({
  collection: 'tasks',
  ...defaultSchemaOptions,
})
export class Task extends MongoSchema {
  @Prop()
  @ApiProperty({
    description: 'Task Name',
    example: 'test',
  })
  @IsString()
  name: string;

  @Prop()
  @ApiProperty({
    description: 'Scheduled Time',
    example: 'Alabama',
  })
  @IsDateString()
  scheduled_time: Date;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    description: 'Task Payload',
  })
  payload: any;

  @Prop({ enum: TaskStatus, default: TaskStatus.Pending })
  @ApiProperty({
    description: 'Task Status',
    example: TaskStatus.Pending,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    description: 'Task Result',
  })
  result: any;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    description: 'Task Error',
  })
  error: any;
}
export const TaskSchema = createMongoSchema(Task);
