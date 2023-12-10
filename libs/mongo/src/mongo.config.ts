import { Connection } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs(
  'mongo',
  (): MongooseModuleOptions => ({
    uri: process.env.MONGO_URI || 'mongodb://localhost/nest',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectionFactory: (connection: Connection) => {
      connection.plugin(paginate);
      return connection;
    },
  }),
);
