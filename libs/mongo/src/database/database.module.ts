import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { set } from 'mongoose';
import { inspect } from 'util';

import mongoConfig from '../mongo.config';

export const logger: Logger = new Logger('MongoQueryLog');
const setLogger = () => {
  set('debug', (collectionName, methodName, ...methodArgs) => {
    logger.debug(
      `\x1B[0m${collectionName}.${methodName}` +
        `(${methodArgs
          .map((m) =>
            inspect(m, false, 10, true)
              .replace(/\n/g, '')
              .replace(/\s{2,}/g, ' '),
          )
          .join(', ')})`,
    );
  });
};

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [mongoConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get('MONGO_LOGGING') === 'Y') {
          setLogger();
        }
        return config.get('mongo');
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
