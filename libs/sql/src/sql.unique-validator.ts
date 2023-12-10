import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SqlModel } from './sql.model';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class SqlUniqueValidator<M> implements ValidatorConstraintInterface {
  constructor(private sequelize: Sequelize) {}

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
      return this.sequelize.models[modelNameOrOption]
        .findOne({ where: { [property]: value } })
        .then((data) => {
          return data === null;
        });
    } else {
      const { modelName, options } = modelNameOrOption;
      const findOptions =
        typeof options === 'function' ? options(args) : options;
      return this.sequelize.models[modelName]
        .findOne({ where: { [property]: value }, ...findOptions })
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
  options?: ((args: ValidationArguments) => FindOptions<M>) | FindOptions<M>;
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
            [Op.like]: `${args.value}%`,
          },
        },
        paranoid: false,
      };
    },
 * })
 * name: string;
 * ```
 */
export function IsUnique<M extends SqlModel = any>(
  options: UniqueValidatorOptions<M>,
  validationOptions?: ValidationOptions,
): any;

export function IsUnique<M extends SqlModel = any>(
  modelNameOrOption: string | UniqueValidatorOptions<M>,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [modelNameOrOption],
      validator: SqlUniqueValidator<M>,
    });
  };
}
