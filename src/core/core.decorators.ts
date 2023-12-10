import {
  applyDecorators,
  Type,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { APP_MIN_VERSION, APP_VERSION } from 'src/app.config';
import { CDNStorage } from 'src/config';
import { MsGuard } from 'src/core/guards/ms.quard';
import {
  QueryDeleteMode,
  QueryLimit,
  QueryOffset,
  QueryPopulate,
  QuerySearch,
  QuerySelect,
  QuerySort,
  QueryWhere,
  ResponseBadRequest,
  ResponseForbidden,
  ResponseInternalServerError,
  VersionHeader,
} from './core.definitions';
import {
  getNumbersBetweenAsString,
  pluralizeString,
  snakeCase,
} from './core.utils';
import { UploadExceptionFilter } from './filters/upload-exception.filter';
import { UploadInterceptor } from './interceptors/upload.interceptors';

export const ApiQueryGetAll = () => {
  return applyDecorators(
    ApiQuery(QueryOffset),
    ApiQuery(QueryLimit),
    ApiQuery(QuerySearch),
    ApiQuery(QuerySelect),
    ApiQuery(QueryWhere),
    ApiQuery(QueryPopulate),
    ApiQuery(QuerySort),
  );
};

export const ApiQueryCountAll = () => {
  return applyDecorators(
    ApiQuery(QuerySearch),
    ApiQuery(QueryWhere),
    ApiQuery(QueryPopulate),
  );
};

export const ApiQueryGetOne = () => {
  return applyDecorators(
    ApiQuery(QueryOffset),
    ApiQuery(QuerySearch),
    ApiQuery(QuerySelect),
    ApiQuery(QueryWhere),
    ApiQuery(QueryPopulate),
    ApiQuery(QuerySort),
  );
};

export const ApiQueryGetById = () => {
  return applyDecorators(ApiQuery(QuerySelect), ApiQuery(QueryPopulate));
};

export const ApiQueryDelete = () => {
  return applyDecorators(ApiQuery(QueryDeleteMode));
};

export const ResponseGetAll = <TModel extends Type<any>>(
  model: TModel,
  collection?: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Ok',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              offset: {
                type: 'number',
                description: 'No of records to skip',
                example: 0,
              },
              limit: {
                type: 'number',
                description: 'No of records to take',
                example: 10,
              },
              count: {
                type: 'number',
                description: 'Total no of records available',
                example: 10,
              },
              [collection || pluralizeString(snakeCase(model.name))]: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          },
          message: {
            type: 'string',
            example: 'Ok',
          },
        },
      },
    }),
  );
};

export const ResponseCountAll = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Ok',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                description: 'Total no of records available',
                example: 10,
              },
            },
          },
          message: {
            type: 'string',
            example: 'Ok',
          },
        },
      },
    }),
  );
};

export const ResponseCreated = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'Created',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Created',
          },
        },
      },
    }),
  );
};

export const ResponseUpdated = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Updated',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Updated',
          },
        },
      },
    }),
  );
};

export const ResponseGetOne = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Ok',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Ok',
          },
        },
      },
    }),
  );
};

export const ResponseDeleted = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Deleted',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Deleted',
          },
        },
      },
    }),
  );
};

export const ApiErrorResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse(ResponseBadRequest),
    ApiForbiddenResponse(ResponseForbidden),
    ApiInternalServerErrorResponse(ResponseInternalServerError),
  );
};

export interface FileUploadFields extends MulterField {
  required?: boolean;
  bodyField?:
    | string
    | {
        [key: string]: string;
      };
  cdn?: CDNStorage;
}

export interface FileUploadOptions extends MulterOptions {
  cdn?: CDNStorage;
}

export const FileUploads = (
  fields: FileUploadFields[],
  options?: FileUploadOptions,
) => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FileFieldsInterceptor(fields, options),
      ...fields.map((x) => new UploadInterceptor(x, options)),
    ),
    UseFilters(new UploadExceptionFilter()),
  );
};

export const MsListener = (metadata?: string) => {
  return applyDecorators(UseGuards(MsGuard), MessagePattern(metadata));
};

export const ForVersion = (version: number) => {
  return applyDecorators(Version(`${version}`), ApiHeader(VersionHeader));
};

export const FromVersion = (version: number) => {
  return applyDecorators(
    Version(getNumbersBetweenAsString(version, Math.max(APP_VERSION, version))),
    ApiHeader(VersionHeader),
  );
};

export const TillVersion = (version: number) => {
  return applyDecorators(
    Version(
      getNumbersBetweenAsString(Math.min(APP_MIN_VERSION, version), version),
    ),
    ApiHeader(VersionHeader),
  );
};

export const BetweenVersions = (from: number, to: number) => {
  return applyDecorators(
    Version(
      getNumbersBetweenAsString(
        Math.min(APP_MIN_VERSION, from),
        Math.max(APP_VERSION, to),
      ),
    ),
    ApiHeader(VersionHeader),
  );
};
