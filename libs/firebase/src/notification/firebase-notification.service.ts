import { Inject, Injectable } from '@nestjs/common';
import {
  BatchResponse,
  MessagingTopicManagementResponse,
} from 'firebase-admin/lib/messaging/messaging-api';
import { Job, JobResponse } from 'src/core/core.job';
import { FirebaseAdminSDK, FIREBASE_ADMIN_INJECT } from '../admin';

@Injectable()
export class FirebaseNotificationService {
  constructor(
    @Inject(FIREBASE_ADMIN_INJECT) private firebaseAdmin: FirebaseAdminSDK,
  ) {}

  /**
   * Subscribe to a unique topic to send notifications
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async subscribeTopic(
    job: Job,
  ): Promise<JobResponse<MessagingTopicManagementResponse>> {
    let error = false,
      data = null;
    try {
      data = await this.firebaseAdmin
        .messaging()
        .subscribeToTopic(job.payload.tokens, job.payload.topic);
    } catch (err) {
      error = err;
    }
    return { error, data };
  }

  /**
   * UnSubscribe from subscribed unique topic
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async unSubscribeTopic(
    job: Job,
  ): Promise<JobResponse<MessagingTopicManagementResponse>> {
    let error = false,
      data = null;
    try {
      data = await this.firebaseAdmin
        .messaging()
        .unsubscribeFromTopic(job.payload.tokens, job.payload.topic);
    } catch (err) {
      error = err;
    }
    return { error, data };
  }

  /**
   * Send message to a token
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async send(job: Job): Promise<JobResponse<string>> {
    let error = false,
      data = null;
    try {
      data = await this.firebaseAdmin.messaging().send(job.payload);
    } catch (err) {
      error = err;
    }
    return { error, data };
  }

  /**
   * Send message to multiple tokens
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async sendMulticast(job: Job): Promise<JobResponse<BatchResponse>> {
    let error = false,
      data = null;
    try {
      if (!job.payload.tokens || !job.payload.tokens.length)
        return { error: `Invalid tokens` };
      data = await this.firebaseAdmin.messaging().sendMulticast(job.payload);
    } catch (err) {
      error = err;
    }
    return { error, data };
  }
}
