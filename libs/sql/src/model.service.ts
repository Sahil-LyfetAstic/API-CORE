/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { DeletePayload, ReadPayload, WritePayload } from './sql.decorator';
import {
  SqlCountResponse,
  SqlCreateResponse,
  SqlDeleteResponse,
  SqlGetAllResponse,
  SqlGetOneResponse,
  SqlJob,
  SqlUpdateResponse,
  WrapSqlJob,
} from './sql.job';
import { SqlModel } from './sql.model';
import { SqlService } from './sql.service';

export class ModelService<M extends SqlModel> {
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

  constructor(protected readonly db: SqlService<M>) {}

  /**
   * doBeforeRead
   * @function function will execute before findAll, getCount, findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeRead(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeFind
   * @function function will execute before findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeFind(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeFindAll
   * @function function will execute before findAll function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeFindAll(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeCount
   * @function function will execute before getCount function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeCount(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeWrite
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeWrite(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeCreate
   * @function function will execute before create function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeCreate(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeUpdate
   * @function function will execute before update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeUpdate(job: SqlJob<M>): Promise<void> {}

  /**
   * doBeforeDelete
   * @function function will execute before delete function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  protected async doBeforeDelete(job: SqlJob<M>): Promise<void> {}

  /**
   * findAll
   * @function search and get records with total count and pagination
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  @WrapSqlJob
  @ReadPayload
  async findAll(job: SqlJob<M>): Promise<SqlGetAllResponse<M>> {
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
  @WrapSqlJob
  @ReadPayload
  async getCount(job: SqlJob<M>): Promise<SqlCountResponse> {
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
  @WrapSqlJob
  @ReadPayload
  async findById(job: SqlJob<M>): Promise<SqlGetOneResponse<M>> {
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
  @WrapSqlJob
  @ReadPayload
  async findOne(job: SqlJob<M>): Promise<SqlGetOneResponse<M>> {
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
  @WrapSqlJob
  @WritePayload
  async create(job: SqlJob<M>): Promise<SqlCreateResponse<M>> {
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
  @WrapSqlJob
  @WritePayload
  async update(job: SqlJob<M>): Promise<SqlUpdateResponse<M>> {
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
  @WrapSqlJob
  @DeletePayload
  async delete(job: SqlJob<M>): Promise<SqlDeleteResponse<M>> {
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
    job: SqlJob<M>,
    response: SqlGetOneResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterFindAll
   * @function function will execute after findAll function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterFindAll(
    job: SqlJob<M>,
    response: SqlGetAllResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterCount
   * @function function will execute after getCount function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterCount(
    job: SqlJob<M>,
    response: SqlCountResponse,
  ): Promise<void> {}

  /**
   * doAfterWrite
   * @function function will execute after create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterWrite(
    job: SqlJob<M>,
    response: SqlCreateResponse<M> | SqlUpdateResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterCreate
   * @function function will execute after create function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterCreate(
    job: SqlJob<M>,
    response: SqlCreateResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterUpdate
   * @function function will execute after update function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterUpdate(
    job: SqlJob<M>,
    response: SqlUpdateResponse<M>,
  ): Promise<void> {}

  /**
   * doAfterDelete
   * @function function will execute after delete function
   * @param {object} job - mandatory - a job object representing the job information
   * @param {object} response - mandatory - a object representing the job response information
   * @return {void}
   */
  protected async doAfterDelete(
    job: SqlJob<M>,
    response: SqlDeleteResponse<M>,
  ): Promise<void> {}
}
