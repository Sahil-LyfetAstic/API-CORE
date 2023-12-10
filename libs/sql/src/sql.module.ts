import { Op } from 'sequelize';

import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule as MongoDatabaseModule } from '@core/mongo/database';
import { SequelizeModule } from '@nestjs/sequelize';
import { Model, ModelStatic, SequelizeOptions } from 'sequelize-typescript';
import { DatabaseModule } from './database';
import { SeederModule } from './seeder';
import { SqlService } from './sql.service';
import { SqlUniqueValidator } from './sql.unique-validator';

export const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $or: Op.or,
};

export interface SqlModuleOption {
  seeder?: boolean;
}

export interface SqlOption {
  history?: boolean;
  historyExpireIn?: number;
  trashExpireIn?: number;
}

@Module({})
export class SqlModule {
  static root(options?: SqlModuleOption): DynamicModule {
    const imports = [];
    imports.push(DatabaseModule);
    if (options && options.seeder) {
      imports.push(SeederModule);
    }
    return {
      module: SqlModule,
      imports,
    };
  }

  static register(
    entity: ModelStatic<Model>,
    options?: SqlOption,
    connection?: SequelizeOptions | string,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        SequelizeModule.forFeature([entity], connection),
        MongoDatabaseModule,
      ],
      providers: [
        {
          provide: 'MODEL_NAME',
          useValue: entity.name,
        },
        {
          provide: 'MODEL_OPTIONS',
          useValue: options || {},
        },
        SqlService,
        SqlUniqueValidator,
      ],
      exports: [SqlService],
    };
  }
}
