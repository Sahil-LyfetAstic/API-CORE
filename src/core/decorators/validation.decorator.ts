import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

/**
 * Validate if value is equal to another field value
 */
export function IsEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: ({ property, constraints: [targetField] }) => {
          return `${property} should be equal to ${targetField}`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}

/**
 * Validate if value is not equal to another field value
 */
export function IsNotEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: ({ property, constraints: [targetField] }) => {
          return `${property} should not be equal to ${targetField}`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
      },
    });
  };
}

/**
 * Validate if value is greater than another field value
 */
export function IsGreaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: ({ property, constraints: [targetField] }) => {
          return `${property} should be greater than ${targetField}`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (relatedValue instanceof Date
                ? new Date(value).valueOf() > new Date(relatedValue).valueOf()
                : value > relatedValue))
          );
        },
      },
    });
  };
}

/**
 * Validate if value is greater than or equal to another field value
 */
export function IsGreaterThanEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: ({ property, constraints: [targetField] }) => {
          return `${property} should be greater than or equal to ${targetField}`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (relatedValue instanceof Date
                ? new Date(value).valueOf() >= new Date(relatedValue).valueOf()
                : value >= relatedValue))
          );
        },
      },
    });
  };
}

/**
 * Validate if value is less than another field value
 */
export function IsLessThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: ({ property, constraints: [targetField] }) => {
          return `${property} should be less than ${targetField}`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (relatedValue instanceof Date
                ? new Date(value).valueOf() < new Date(relatedValue).valueOf()
                : value < relatedValue))
          );
        },
      },
    });
  };
}

/**
 * Validate if value is less than or equal to another field value
 */
export function IsLessThanEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLessThanEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: ({ property, constraints: [targetField] }) => {
          return `${property} should be less than or equal to ${targetField}`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (relatedValue instanceof Date
                ? new Date(value).valueOf() <= new Date(relatedValue).valueOf()
                : value <= relatedValue))
          );
        },
      },
    });
  };
}
