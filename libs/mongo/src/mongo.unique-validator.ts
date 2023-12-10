import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Connection } from 'mongoose';
import { MongoJobOptions } from './mongo.job';
import { MongoSchema } from './mongo.schema';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class MongoUniqueValidator<M> implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  async validate(value: any, args: ValidationArguments) {
    const {
      property,
      constraints: [modelNameOrOption],
    }: {
      property: string;
      constraints: (string | UniqueValidatorOptions<M>)[];
    } = args;
    if (typeof value === 'undefined') return true;
    if (typeof modelNameOrOption === 'string') {
      return this.connection.models[modelNameOrOption]
        .findOne({ [property]: value })
        .then((data) => {
          return data === null;
        });
    } else {
      const { modelName, options } = modelNameOrOption;
      const findOptions =
        typeof options === 'function' ? options(args) : options;
      return this.connection.models[modelName]
        .findOne(findOptions.where || { [property]: value }, null, findOptions)
        .then((data) => {
          return data === null;
        });
    }
  }

  public defaultMessage({
    property,
    constraints: [modelNameOrOption],
  }: {
    property: string;
    constraints: (string | UniqueValidatorOptions<M>)[];
  }) {
    const modelName =
      typeof modelNameOrOption === 'string'
        ? modelNameOrOption
        : modelNameOrOption.modelName;
    return `${modelName} with same ${property} already exist`;
  }
}

export interface UniqueValidatorOptions<M> {
  modelName: string;
  options?:
    | ((args: ValidationArguments) => MongoJobOptions<M>)
    | MongoJobOptions<M>;
}

/**
 * Decorator to set a field unique in the database
 *
 * @param {string} modelName Name of the model
 * @param {ValidationOptions} [validationOptions] Other validation options
 *
 * Eg: Set `name` field unique in `Page` module
 *```js
 * @IsUnique('Page')
 * name: string;
 * ```
 */
export function IsUnique(
  modelName: string,
  validationOptions?: ValidationOptions,
): any;

/**
 * Decorator to set a field unique in the database
 *
 * @param {UniqueValidatorOptions} options Unique validator options
 * @param {ValidationOptions} [validationOptions] Other validation options
 *
 * Eg: Set `name` field unique in `Page` module (include deleted records also)
 *```js
 * @IsUnique({
 *  modelName: 'Page',
 *  options: {
 *    paranoid: false
 *  }
 * })
 * name: string;
 * ```
 * Eg: Set `name` field unique in `Page` module based on custom where conditions
 *```js
 * @IsUnique({
 *  modelName: 'Page',
 *  options(args: ValidationArguments) {
      return {
        where: {
          name: {
            $eq: args.value,
          },
        },
        paranoid: false,
      };
    },
 * })
 * name: string;
 * ```
 */
export function IsUnique<M extends MongoSchema = any>(
  options: UniqueValidatorOptions<M>,
  validationOptions?: ValidationOptions,
): any;

export function IsUnique<M extends MongoSchema = any>(
  modelNameOrOption: string | UniqueValidatorOptions<M>,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [modelNameOrOption],
      validator: MongoUniqueValidator<M>,
    });
  };
}
