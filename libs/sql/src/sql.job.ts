import {
  BulkCreateOptions,
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  FindOrBuildOptions,
} from 'sequelize';
import { Job, JobResponse } from 'src/core/core.job';
import { SqlModel } from './sql.model';
import { ModelWrap } from './sql.service';

export type SqlJobOptions<M> = FindOptions<M> &
  CreateOptions<M> &
  BulkCreateOptions<M> &
  FindAndCountOptions<M> &
  CountOptions<M> &
  DestroyOptions<M> &
  FindOrBuildOptions & {
    /**
     * Enable pagination, default is false
     * @default false
     */
    pagination?: boolean;
    /**
     * Get response even if record not found, by default false and it throws an error if record not found
     * @default false
     */
    allowEmpty?: boolean;
    /**
     * Other sequelize options
     */
    sequelizeOptions?: any;
  };

export interface SqlResponse<M = any> extends JobResponse {
  /**
   * Response data
   */
  data?: M;
}

export interface SqlCountResponse extends JobResponse {
  /**
   * Total available records count
   */
  count?: number;
}

export interface SqlGetOneResponse<M> extends JobResponse {
  /**
   * Response data
   */
  data?: ModelWrap<M>;
}

export interface SqlGetAllResponse<M> extends JobResponse {
  /**
   * Response data
   */
  data?: ModelWrap<M>[];
  /**
   * Offset for pagination
   */
  offset?: number;
  /**
   * Limit for pagination
   */
  limit?: number;
  /**
   * Total available records count
   */
  count?: number;
}

export interface SqlCreateResponse<M> extends SqlGetOneResponse<M> {
  /**
   * Is created flag
   */
  created?: boolean;
}

export interface SqlUpdateResponse<M> extends SqlGetOneResponse<M> {
  /**
   * Previous data object
   */
  previousData?: ModelWrap<M>;
}

export interface SqlDeleteResponse<M> extends JobResponse {
  /**
   * Response data
   */
  data?: ModelWrap<M>;
}

export interface SqlCreateBulkResponse<M> extends JobResponse {
  /**
   * Response data
   */
  data?: ModelWrap<M>[];
}

export interface SqlJob<M extends SqlModel> extends Job {
  /**
   * primary key name of the model
   */
  pk?: string;
  /**
   * primary key value of the model
   */
  id?: number;
  /**
   * body object used for create or update
   */
  body?: Partial<M> & {
    [key: string]: any;
  };
  /**
   * array of records used for bulk create
   */
  records?: {
    [key: string]: any;
  }[];
  /**
   * parameters for sql
   */
  options?: SqlJobOptions<M>;
}

export class SqlJob<M extends SqlModel> extends Job {
  constructor(job: SqlJob<M>) {
    super(job);
    this.pk = job.pk || 'id';
    this.id = job.id || null;
    this.body = job.body || {};
    this.records = job.records || [];
    this.options = job.options || {};
  }
}

export function WrapSqlJob<T extends SqlModel>(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (job: SqlJob<T> | object, ...args: any[]) {
    if (!(job instanceof SqlJob)) {
      job = new SqlJob(job);
    }
    return originalMethod.apply(this, [job, ...args]);
  };
}
