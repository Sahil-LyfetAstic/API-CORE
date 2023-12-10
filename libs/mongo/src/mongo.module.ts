import { DynamicModule, Module } from '@nestjs/common';
import {
  AsyncModelFactory,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { DatabaseModule } from './database';
import { MongoService } from './mongo.service';
import { MongoUniqueValidator } from './mongo.unique-validator';
import { SeederModule } from './seeder/';

export interface MongoModuleOption {
  seeder?: boolean;
}

export interface MongoOption {
  history?: boolean;
  historyExpireIn?: number;
  trashExpireIn?: number;
}

@Module({})
export class MongoModule {
  static root(options?: MongoModuleOption): DynamicModule {
    const imports = [];
    imports.push(DatabaseModule);
    if (options && options.seeder) {
      imports.push(SeederModule);
    }
    return {
      module: MongoModule,
      imports,
    };
  }

  static register(
    model: ModelDefinition,
    options?: MongoOption,
    connectionName?: string,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forFeature([model], connectionName)],
      providers: [
        {
          provide: 'MODEL_NAME',
          useValue: model.name,
        },
        {
          provide: 'MODEL_OPTIONS',
          useValue: options || {},
        },
        MongoService,
      ],
      exports: [MongoService],
    };
  }

  static registerAsync(
    modelFactory: AsyncModelFactory,
    options?: MongoOption,
    connectionName?: string,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forFeatureAsync([modelFactory], connectionName)],
      providers: [
        {
          provide: 'MODEL_NAME',
          useValue: modelFactory.name,
        },
        {
          provide: 'MODEL_OPTIONS',
          useValue: options || {},
        },
        MongoService,
        MongoUniqueValidator,
      ],
      exports: [MongoService],
    };
  }
}
