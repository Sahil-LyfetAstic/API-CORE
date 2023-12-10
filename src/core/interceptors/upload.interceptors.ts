import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import config, { CDNStorage } from 'src/config';
import { FileUploadFields, FileUploadOptions } from 'src/core/core.decorators';
import { UploadException } from '../core.errors';

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  constructor(
    private field: FileUploadFields,
    private options?: FileUploadOptions,
  ) {
    this.options = this.options || {};
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { body, files } = context.switchToHttp().getRequest();
    /* Fix body properties for null strings */
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        if (body[key] === 'null') {
          body[key] = null;
        }
        if (body[key] === 'false') {
          body[key] = false;
        }
      }
    }
    if (typeof files === 'undefined') return next.handle();
    if (this.field.required && typeof files[this.field.name] === 'undefined') {
      throw new UploadException({
        field: this.field.name,
        message: `File ${this.field.name} is required`,
      });
    }
    if (
      typeof this.field.bodyField === 'string' &&
      typeof files[this.field.name] !== 'undefined'
    ) {
      this.field.cdn =
        this.field.cdn || this.options.cdn || config().cdnStorage;
      if (this.field.cdn === CDNStorage.Azure)
        body[this.field.bodyField] = `${files[this.field.name][0].container}/${
          files[this.field.name][0].blobName
        }`;
      else if (this.field.cdn === CDNStorage.Aws)
        body[this.field.bodyField] = files[this.field.name][0].key;
      else body[this.field.bodyField] = files[this.field.name][0].filename;
    }
    if (
      typeof this.field.bodyField === 'object' &&
      typeof files[this.field.name] !== 'undefined'
    ) {
      for (const key in this.field.bodyField) {
        if (Object.prototype.hasOwnProperty.call(this.field.bodyField, key)) {
          const prop = this.field.bodyField[key];
          body[key] = files[this.field.name][0][prop];
        }
      }
    }
    return next.handle();
  }
}
