import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import sqlConfig from '../sql.config';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [sqlConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('sql'),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
