import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, HydratedDocument, Model, PaginateModel } from 'mongoose';
import { NotFoundError } from 'src/core/core.errors';
import { addDays } from 'src/core/core.utils';
import {
  MongoCountResponse,
  MongoCreateBulkResponse,
  MongoCreateResponse,
  MongoDeleteResponse,
  MongoGetAllResponse,
  MongoGetOneResponse,
  MongoJob,
  MongoResponse,
  MongoUpdateResponse,
  WrapMongoJob,
} from './mongo.job';
import { MongoOption } from './mongo.module';
import {
  DefaultSchemaMethods,
  DefaultSchemaStaticMethods,
  MongoSchema,
} from './mongo.schema';

export type MongoDocument<T> = Document &
  MongoSchema &
  T &
  DefaultSchemaMethods;
export type ModelWrap<T> = HydratedDocument<MongoDocument<T>>;
export type MongoModel<T> = Model<MongoDocument<T>> &
  DefaultSchemaStaticMethods<MongoDocument<T>> &
  PaginateModel<MongoDocument<T>>;

@Injectable()
export class MongoService<M extends MongoSchema> {
  private readonly model: MongoModel<M>;

  constructor(
    @Inject('MODEL_NAME') modelName: string,
    @Inject('MODEL_OPTIONS') private options: MongoOption,
    @InjectConnection() private connection: Connection,
    private _config: ConfigService,
  ) {
    this.model = connection.models[modelName] as MongoModel<M>;
  }

  /**
   * Create a new record using model's create method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async createRecord(job: MongoJob<M>): Promise<MongoCreateResponse<M>> {
    try {
      const { body, owner, options } = job;
      if (typeof body === 'undefined')
        return {
          error: 'Error calling createRecord - body is missing',
        };
      let data = new this.model(body);
      if (owner && owner.id) {
        data.set('created_by', owner.id);
        data.set('updated_by', owner.id);
      }
      await data.save();

      if (this.options.history) {
        // Create history
        this.connection.models.History.create({
          entity: this.model.name,
          entity_id: data._id,
          action: 'CreateRecord',
          created: true,
          data: JSON.parse(JSON.stringify(data)),
          expire_in: addDays(this.options.historyExpireIn),
        });
      }

      const { populate } = options;
      if (populate) {
        data = await data.populate(populate);
      }
      return { data, created: true };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Create bulk records using model's bulkCreate method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async createBulkRecords(
    job: MongoJob<M>,
  ): Promise<MongoCreateBulkResponse<M>> {
    try {
      const { records, owner, options } = job;
      if (!records.length)
        return {
          error: 'Error calling createBulkRecord - records are missing',
        };
      if (owner && owner.id) {
        records.forEach((x) => {
          x.created_by = owner.id;
          x.updated_by = owner.id;
        });
      }
      const data = await this.model.create(records, options);

      if (this.options.history) {
        // Create history
        this.connection.models.History.create({
          entity: this.model.name,
          action: 'CreateBulkRecords',
          created: true,
          data: JSON.parse(JSON.stringify(data)),
          expire_in: addDays(this.options.historyExpireIn),
        });
      }
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Update a record using model's findByPk and save methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async updateRecord(job: MongoJob<M>): Promise<MongoUpdateResponse<M>> {
    try {
      const { id, body, owner, pk, options } = job;
      if (!id) return { error: 'Error calling updateRecord - id is missing' };
      if (typeof body === 'undefined')
        return {
          error: 'Error calling updateRecord - body is missing',
        };
      const { where = {}, projection, populate } = options;
      let data = await this.model.findOne(
        {
          ...where,
          [pk]: job.id,
        },
        projection,
        options,
      );
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      for (const prop in body) {
        data[prop] = body[prop];
      }
      if (owner && owner.id) {
        data.set('updated_by', owner.id);
      }
      await data.save();

      if (this.options.history) {
        // Create history
        this.connection.models.History.create({
          entity: this.model.name,
          entity_id: data._id,
          action: 'UpdateRecord',
          data: JSON.parse(JSON.stringify(data)),
          previous_data: previousData,
          expire_in: addDays(this.options.historyExpireIn),
        });
      }

      if (populate) {
        data = await data.populate(populate);
      }

      return { data, previousData };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find and update a record using model's findOne and save methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async findAndUpdateRecord(job: MongoJob<M>): Promise<MongoUpdateResponse<M>> {
    try {
      const { body, owner, options } = job;
      if (typeof body === 'undefined')
        return {
          error: 'Error calling findAndUpdateRecord - body is missing',
        };
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling findAndUpdateRecord - options.where is missing',
        };
      const { where = {}, projection } = options;
      const data = await this.model.findOne(where, projection, options);
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      for (const prop in body) {
        data[prop] = body[prop];
      }
      if (owner && owner.id) {
        data.set('updated_by', owner.id);
      }
      await data.save();

      if (this.options.history) {
        // Create history
        this.connection.models.History.create({
          entity: this.model.name,
          entity_id: data._id,
          action: 'FindAndUpdateRecord',
          data: JSON.parse(JSON.stringify(data)),
          previous_data: previousData,
          expire_in: addDays(this.options.historyExpireIn),
        });
      }

      return { data, previousData };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Update bulk records using model's update methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async updateBulkRecords(job: MongoJob<M>): Promise<MongoResponse> {
    try {
      const { body, owner, options } = job;
      if (typeof body === 'undefined')
        return {
          error: 'Error calling updateBulkRecords - body is missing',
        };
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling updateBulkRecords - options.where is missing',
        };
      if (owner && owner.id) {
        body.updated_by = owner.id;
      }
      const { where = {} } = options;
      const data = await this.model.updateMany(where, body, options);
      if (this.options.history) {
        // Create history
        this.connection.models.History.create({
          entity: this.model.name,
          action: 'UpdateBulkRecords',
          data: JSON.parse(JSON.stringify(data)),
          expire_in: addDays(this.options.historyExpireIn),
        });
      }
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get paginated results using model's findAndCountAll method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async getAllRecords(job: MongoJob<M>): Promise<MongoGetAllResponse<M>> {
    try {
      const { options } = job;
      const {
        where = {},
        projection,
        pagination = false,
        withDeleted = false,
      } = options;
      options.limit = options.limit
        ? +options.limit === -1
          ? 1000
          : +options.limit
        : this._config.get('paginationLimit');
      if (pagination) {
        const data = await this.model.paginate(where, {
          ...options,
          lean: Boolean(options.lean), // type mismatch fix
          options: {
            withDeleted,
          },
        });
        return {
          data: data.docs,
          offset: data.offset,
          limit: data.limit,
          count: data.totalDocs,
        };
      } else {
        const data = await this.model.find(where, projection, options);
        return {
          data: data,
        };
      }
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get total count of record using model's findAndCountAll method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async countAllRecords(job: MongoJob<M>): Promise<MongoCountResponse> {
    try {
      const { where = {} } = job.options;
      const data = await this.model.countDocuments(where, job.options);
      return { count: data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find a record using model's findByPk method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async findRecordById(job: MongoJob<M>): Promise<MongoGetOneResponse<M>> {
    try {
      const { id, pk, options } = job;
      if (!id) return { error: 'Error calling findRecordById - id is missing' };
      const { where = {}, projection, allowEmpty } = options;
      const data = await this.model.findOne(
        { ...where, [pk]: id },
        projection,
        options,
      );
      if (data === null && !allowEmpty)
        throw new NotFoundError('Record not found');
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find a record using model's findOne method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async findOneRecord(job: MongoJob<M>): Promise<MongoGetOneResponse<M>> {
    try {
      const { options } = job;
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling findOneRecord - options.where is missing',
        };
      const { where = {}, projection, allowEmpty } = options;
      const data = await this.model.findOne(where, projection, options);
      if (data === null && !allowEmpty)
        throw new NotFoundError('Record not found');
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Add sub-document to a record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async addSubDocument(job: MongoJob<M>): Promise<MongoUpdateResponse<M>> {
    try {
      const { id, pk, body, options, owner } = job;
      if (!id) return { error: 'Error calling addSubDocument - id is missing' };
      const { subDocumentField, where = {}, projection, populate } = options;
      if (!subDocumentField)
        return {
          error:
            'Error calling addSubDocument - options.subDocumentField is missing',
        };
      let data = await this.model.findOne(
        {
          ...where,
          [pk]: id,
        },
        projection,
        options,
      );
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      data[subDocumentField].push(body);
      if (owner && owner.id) {
        data.set('updated_by', owner.id);
      }
      await data.save();
      if (populate) {
        data = await data.populate(populate);
      }
      return { data, previousData };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Remove sub-document to a record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async removeSubDocument(job: MongoJob<M>): Promise<MongoUpdateResponse<M>> {
    try {
      const { id, pk, options, owner } = job;
      if (!id)
        return { error: 'Error calling removeSubDocument - id is missing' };
      const {
        subDocumentField,
        subDocumentId,
        where = {},
        projection,
        populate,
      } = options;
      if (!subDocumentField)
        return {
          error:
            'Error calling removeSubDocument - options.subDocumentField is missing',
        };
      if (!subDocumentId)
        return {
          error:
            'Error calling removeSubDocument - options.subDocumentId is missing',
        };
      let data = await this.model.findOne(
        {
          ...where,
          [pk]: job.id,
        },
        projection,
        options,
      );
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      data[subDocumentField].pull(subDocumentId);
      if (owner && owner.id) {
        data.set('updated_by', owner.id);
      }
      await data.save();
      if (populate) {
        data = await data.populate(populate);
      }
      return { data, previousData };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find or create a record using model's findOne and create methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async findOrCreate(job: MongoJob<M>): Promise<MongoCreateResponse<M>> {
    try {
      const { body, options, owner } = job;
      if (typeof body === 'undefined')
        return {
          error: 'Error calling findOrCreate - body is missing',
        };
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling findOrCreate - options.where is missing',
        };
      const { where = {}, projection } = options;
      let data = await this.model.findOne(where, projection, options);
      let created = false;
      if (data === null) {
        data = new this.model(body);
        if (owner && owner.id) {
          data.set('created_by', owner.id);
          data.set('updated_by', owner.id);
        }
        await data.save();
        created = true;
      }

      if (this.options.history) {
        // Create history
        this.connection.models.History.create({
          entity: this.model.name,
          entity_id: data._id,
          action: 'FindOrCreate',
          created,
          data: JSON.parse(JSON.stringify(data)),
          expire_in: addDays(this.options.historyExpireIn),
        });
      }
      return { data, created };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Create or update a record using model's findOne and create methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async createOrUpdate(job: MongoJob<M>): Promise<MongoCreateResponse<M>> {
    try {
      const { body, options, owner } = job;
      if (typeof body === 'undefined')
        return {
          error: 'Error calling createOrUpdate - body is missing',
        };
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling createOrUpdate - options.where is missing',
        };
      const { where = {}, projection } = options;
      let created = false;
      let data = await this.model.findOne(where, projection, options);
      if (data !== null) {
        const previousData = JSON.parse(JSON.stringify(data));
        for (const prop in body) {
          data[prop] = body[prop];
        }
        if (owner && owner.id) {
          data.set('updated_by', owner.id);
        }
        await data.save();
        if (this.options.history) {
          // Create history
          this.connection.models.History.create({
            entity: this.model.name,
            entity_id: data._id,
            action: 'CreateOrUpdate',
            data: JSON.parse(JSON.stringify(data)),
            previous_data: previousData,
            expire_in: addDays(this.options.historyExpireIn),
          });
        }
      } else {
        data = new this.model(body);
        if (owner && owner.id) {
          data.set('created_by', owner.id);
          data.set('updated_by', owner.id);
        }
        await data.save();
        created = true;
        if (this.options.history) {
          // Create history
          this.connection.models.History.create({
            entity: this.model.name,
            entity_id: data._id,
            action: 'FindOrCreate',
            created: true,
            data: JSON.parse(JSON.stringify(data)),
            expire_in: addDays(this.options.historyExpireIn),
          });
        }
      }
      return { data, created };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Delete a record using model's destroy method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async deleteRecord(job: MongoJob<M>): Promise<MongoGetOneResponse<M>> {
    try {
      const { id, pk, options, owner } = job;
      if (!id) return { error: 'Error calling deleteRecord - id is missing' };
      const { where = {}, hardDelete = false } = options;
      const data = await this.model.findOne(
        {
          ...where,
          [pk]: id,
        },
        null,
        {
          ...options,
          withDeleted: hardDelete,
        },
      );
      if (data === null) throw new NotFoundError('Record not found');
      await data.delete({
        force: hardDelete,
        deletedBy: owner.id,
      });

      if (hardDelete) {
        // move data into trash
        this.connection.models.Trash.create({
          entity: this.model.name,
          entity_id: data._id,
          action: 'DeleteRecord',
          data: JSON.parse(JSON.stringify(data)),
          expire_in: addDays(this.options.trashExpireIn),
        });
      }
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find and delete a record using model's findOne and destroy methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async findAndDeleteRecord(job: MongoJob<M>): Promise<MongoDeleteResponse<M>> {
    try {
      const { options, owner } = job;
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling findAndDeleteRecord - options.where is missing',
        };
      const { where = {}, hardDelete = false } = options;
      const data = await this.model.findOne(where, null, {
        ...options,
        withDeleted: hardDelete,
      });
      if (data === null) throw new NotFoundError('Record not found');
      await data.delete({
        force: hardDelete,
        deletedBy: owner.id,
      });
      if (job.options.hardDelete) {
        this.connection.models.Trash.create({
          entity: this.model.name,
          entity_id: data._id,
          action: 'FindAndDeleteRecord',
          data: JSON.parse(JSON.stringify(data)),
          expire_in: addDays(this.options.trashExpireIn),
        });
      }
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Delete bulk records using model's destroy methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async deleteBulkRecords(job: MongoJob<M>): Promise<MongoResponse> {
    try {
      const { options, owner } = job;
      if (typeof options.where === 'undefined')
        return {
          error: 'Error calling deleteBulkRecords - options.where is missing',
        };
      const { where = {}, hardDelete = false } = options;
      const data = await this.model.bulkDelete(where, {
        force: hardDelete,
        deletedBy: owner.id,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Restore a soft deleted record using model's restore method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async restoreRecord(job: MongoJob<M>): Promise<MongoGetOneResponse<M>> {
    try {
      const { id, pk, options, owner } = job;
      if (!id) return { error: 'Error calling restoreRecord - id is missing' };
      const { where = {} } = options;
      const data = await this.model.findOne({ ...where, [pk]: id }, null, {
        ...options,
        onlyDeleted: true,
      });
      if (data === null) throw new NotFoundError('Record not found');
      await data.restore({
        restoredBy: owner.id,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get aggregate results using model's aggregate method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  async aggregateRecords(job: MongoJob<M>): Promise<MongoResponse> {
    try {
      const { aggregate, aggregateOptions, withDeleted } = job.options;
      const data = await this.model.aggregate(aggregate, {
        ...aggregateOptions,
        withDeleted,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
