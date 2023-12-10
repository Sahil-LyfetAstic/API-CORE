import { MongoDocument } from '@core/mongo';
import { defaultSchemaOptions, MongoSchema } from '@core/mongo/mongo.schema';
import { createMongoSchema } from '@core/mongo/mongo.utils';
import { Prop, Schema } from '@nestjs/mongoose';

export type JobLogDocument = MongoDocument<JobLog>;

@Schema({
  collection: 'job_logs',
  ...defaultSchemaOptions,
})
export class JobLog extends MongoSchema {
  @Prop({ type: 'Mixed' })
  owner: any;

  @Prop()
  app: string;

  @Prop()
  action: string;

  @Prop()
  queue: string;

  @Prop()
  id: string;

  @Prop({ type: 'Mixed' })
  body: any;

  @Prop({ type: 'Mixed' })
  options: any;

  @Prop({ type: 'Mixed' })
  payload: any;

  @Prop({ type: 'Mixed' })
  response: any;

  @Prop()
  status: string;
}

export const JobLogSchema = createMongoSchema(JobLog);
