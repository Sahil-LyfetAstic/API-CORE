/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { DeletePayload, ReadPayload, WritePayload } from './mongo.decorator';
import {
  MongoCountResponse,
  MongoCreateResponse,
  MongoDeleteResponse,
  MongoGetAllResponse,
  MongoGetOneResponse,
  MongoJob,
  MongoUpdateResponse,
  WrapMongoJob,
} from './mongo.job';
import { MongoSchema } from './mongo.schema';
import { MongoService } from './mongo.service';

export class ModelService<M extends MongoSchema> {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: (keyof M | string)[] = [];

  /**
   * searchPopulate
   * @property array of associations to include for search
   */
  searchPopulate: string[] = [];

  /**
   * @getter $db - Get database service instance
   */
  get $db() {
    return this.db;
  }

  constructor(protected readonly db: MongoService<M>) {}

  /**
   * doBeforeRead
   * @function function will execute before findAll, getCount, findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeRead(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeFind
   * @function function will execute before findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeFind(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeFindAll
   * @function function will execute before findAll function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeFindAll(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeCount
   * @function function will execute before getCount function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeCount(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeWrite
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeWrite(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeCreate
   * @function function will execute before create function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeCreate(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeUpdate
   * @function function will execute before update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeUpdate(job: MongoJob<M>): Promise<void> {}

  /**
   * doBeforeDelete
   * @function function will execute before delete function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeDelete(job: MongoJob<M>): Promise<void> {}

  /**
   * findAll
   * @function search and get records with total count and pagination
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @ReadPayload
  async findAll(job: MongoJob<M>): Promise<MongoGetAllResponse<M>> {
    try {
      await this.doBeforeRead(job);
      await this.doBeforeFindAll(job);
      const response = await this.db.getAllRecords(job);
      if (response.error) throw response.error;
      await this.doAfterFindAll(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * getCount
   * @function search and get records with total count and pagination
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @ReadPayload
  async getCount(job: MongoJob<M>): Promise<MongoCountResponse> {
    try {
      await this.doBeforeRead(job);
      await this.doBeforeCount(job);
      const response = await this.db.countAllRecords(job);
      if (response.error) throw response.error;
      await this.doAfterCount(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * findById
   * @function get a record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @ReadPayload
  async findById(job: MongoJob<M>): Promise<MongoGetOneResponse<M>> {
    try {
      await this.doBeforeRead(job);
      await this.doBeforeFind(job);
      const response = await this.db.findRecordById(job);
      if (response.error) throw response.error;
      await this.doAfterFind(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * findOne
   * @function search and find a record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @ReadPayload
  async findOne(job: MongoJob<M>): Promise<MongoGetOneResponse<M>> {
    try {
      await this.doBeforeRead(job);
      await this.doBeforeFind(job);
      const response = await this.db.findOneRecord(job);
      if (response.error) throw response.error;
      await this.doAfterFind(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * create
   * @function create a new record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @WritePayload
  async create(job: MongoJob<M>): Promise<MongoCreateResponse<M>> {
    try {
      await this.doBeforeWrite(job);
      await this.doBeforeCreate(job);
      const response = await this.db.createRecord(job);
      if (response.error) throw response.error;
      await this.doAfterWrite(job, response);
      await this.doAfterCreate(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * update
   * @function update a record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @WritePayload
  async update(job: MongoJob<M>): Promise<MongoUpdateResponse<M>> {
    try {
      await this.doBeforeWrite(job);
      await this.doBeforeUpdate(job);
      const response = await this.db.updateRecord(job);
      if (response.error) throw response.error;
      await this.doAfterWrite(job, response);
      await this.doAfterUpdate(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * delete
   * @function delete a record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapMongoJob
  @DeletePayload
  async delete(job: MongoJob<M>): Promise<MongoDeleteResponse<M>> {
    try {
      await this.doBeforeDelete(job);
      const response = await this.db.deleteRecord(job);
      if (response.error) throw response.error;
      await this.doAfterDelete(job, response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * doAfterFind
   * @function function will execute after findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterFind(
    job: MongoJob<M>,
    response: MongoGetOneResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterFindAll
   * @function function will execute after findAll function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterFindAll(
    job: MongoJob<M>,
    response: MongoGetAllResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterCount
   * @function function will execute after getCount function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterCount(
    job: MongoJob<M>,
    response: MongoCountResponse,
  ): Promise<void> {}

  /**
   * doAfterWrite
   * @function function will execute after create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterWrite(
    job: MongoJob<M>,
    response: MongoCreateResponse<M> | MongoUpdateResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterCreate
   * @function function will execute after create function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterCreate(
    job: MongoJob<M>,
    response: MongoCreateResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterUpdate
   * @function function will execute after update function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterUpdate(
    job: MongoJob<M>,
    response: MongoUpdateResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterDelete
   * @function function will execute after delete function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterDelete(
    job: MongoJob<M>,
    response: MongoDeleteResponse<M>,
  ): Promise<void> {}
}
