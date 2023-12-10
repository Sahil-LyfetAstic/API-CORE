import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isObject } from 'class-validator';
import { trimFields } from '../core.utils';
import { EXCLUDE_TRIM_FIELDS_KEY } from '../decorators/exclude-trim.decorator';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, { type, metatype }: ArgumentMetadata) {
    if (isObject(value) && type === 'body') {
      const excludeTrimFields: string[] =
        new metatype()[EXCLUDE_TRIM_FIELDS_KEY] || [];
      return Array.isArray(excludeTrimFields)
        ? trimFields(value, excludeTrimFields)
        : value;
    } else {
      return value;
    }
  }
}
