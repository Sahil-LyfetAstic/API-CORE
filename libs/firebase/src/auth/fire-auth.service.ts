import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteUsersResult,
  ListUsersResult,
} from 'firebase-admin/lib/auth/base-auth';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { Job, JobResponse } from 'src/core/core.job';
import { FirebaseAdminSDK, FIREBASE_ADMIN_INJECT } from '../admin';

@Injectable()
export class FireAuthService {
  constructor(
    @Inject(FIREBASE_ADMIN_INJECT) private firebaseAdmin: FirebaseAdminSDK,
  ) {}

  /**
   * listUsers from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async listUsers(job: Job): Promise<JobResponse<ListUsersResult>> {
    try {
      const limit = job.payload.limit;
      const page = job.payload.page;
      const userRecords = await this.firebaseAdmin
        .auth()
        .listUsers(limit, page);
      return { data: userRecords };
    } catch (error) {
      return { error };
    }
  }

  /**
   * getUser from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async getUser(job: Job): Promise<JobResponse<UserRecord>> {
    try {
      const uid = job.payload.uid;
      const userRecord = await this.firebaseAdmin.auth().getUser(uid);
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * getUserByEmail from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async getUserByEmail(job: Job): Promise<JobResponse<UserRecord>> {
    try {
      const email = job.payload.email;
      const userRecord = await this.firebaseAdmin.auth().getUserByEmail(email);
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * getUserByPhoneNumber from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async getUserByPhoneNumber(job: Job): Promise<JobResponse<UserRecord>> {
    try {
      const phone = job.payload.phone;
      const userRecord = await this.firebaseAdmin
        .auth()
        .getUserByPhoneNumber(phone);
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * createUser in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async createUser(job: Job): Promise<JobResponse<UserRecord>> {
    try {
      const body = job.payload.body;
      const claims = job.payload.claims || null;
      const userRecord = await this.firebaseAdmin.auth().createUser(body);
      if (!!claims) {
        await this.firebaseAdmin
          .auth()
          .setCustomUserClaims(userRecord.uid, claims);
      }
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * updateUser in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async updateUser(job: Job): Promise<JobResponse<UserRecord>> {
    try {
      const uid = job.payload.uid;
      const body = job.payload.body;
      const claims = job.payload.claims || null;
      const userRecord = await this.firebaseAdmin.auth().updateUser(uid, body);
      if (!!claims) {
        await this.firebaseAdmin
          .auth()
          .setCustomUserClaims(userRecord.uid, claims);
      }
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * deleteUser in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information to delete Entity
   * @return {object} { error, data }
   */
  async deleteUser(job: Job): Promise<JobResponse<void>> {
    try {
      const uid = job.payload.uid;
      const response = await this.firebaseAdmin.auth().deleteUser(uid);
      return { data: response };
    } catch (error) {
      return { error };
    }
  }

  /**
   * deleteUsers in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information to delete Entity
   * @return {object} { error, data }
   */
  async deleteUsers(job: Job): Promise<JobResponse<DeleteUsersResult>> {
    try {
      const uids = job.payload.uids;
      const deleteUsersResult = await this.firebaseAdmin
        .auth()
        .deleteUsers(uids);
      return { data: deleteUsersResult };
    } catch (error) {
      return { error };
    }
  }

  /**
   * createCustomToken from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async createCustomToken(job: Job): Promise<JobResponse<string>> {
    try {
      const uid = job.payload.uid;
      const additionalClaims = job.payload.additionalClaims || null;
      const customToken = await this.firebaseAdmin
        .auth()
        .createCustomToken(uid, additionalClaims);
      return { data: customToken };
    } catch (error) {
      return { error };
    }
  }

  /**
   * verifyIdToken from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async verifyIdToken(job: Job): Promise<JobResponse<DecodedIdToken>> {
    try {
      const idToken = job.payload.idToken;
      const checkRevoked = job.payload.checkRevoked || false;
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(idToken, checkRevoked);
      return { data: decodedToken };
    } catch (error) {
      return { error };
    }
  }

  /**
   * revokeRefreshTokens from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async revokeRefreshTokens(job: Job): Promise<JobResponse<void>> {
    try {
      const uid = job.payload.uid;
      const response = await this.firebaseAdmin.auth().revokeRefreshTokens(uid);
      return { data: response };
    } catch (error) {
      return { error };
    }
  }

  /**
   * generateEmailVerificationLink from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async generateEmailVerificationLink(job: Job): Promise<JobResponse<string>> {
    try {
      const url = job.payload.url;
      const email = job.payload.email;
      const actionCodeSettings = {
        url,
      };
      const link = await this.firebaseAdmin
        .auth()
        .generateEmailVerificationLink(email, actionCodeSettings);
      return { data: link };
    } catch (error) {
      return { error };
    }
  }

  /**
   * generatePasswordResetLink from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async generatePasswordResetLink(job: Job): Promise<JobResponse<string>> {
    try {
      const url = job.payload.url;
      const email = job.payload.email;
      const actionCodeSettings = {
        url,
      };
      const link = await this.firebaseAdmin
        .auth()
        .generatePasswordResetLink(email, actionCodeSettings);
      return { data: link };
    } catch (error) {
      return { error };
    }
  }
}
