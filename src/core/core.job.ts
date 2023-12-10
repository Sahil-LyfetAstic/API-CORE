import config from 'src/config';

export interface JobResponse<T = any> {
  /**
   * Error object or string
   */
  error?: any;
  /**
   * Error code
   */
  errorCode?: number;
  /**
   * Response data
   */
  data?: T;
  /**
   * Response success or error message
   */
  message?: string;
}

export interface Job {
  /**
   * source app
   */
  app?: string;
  /**
   * job unique id
   */
  uid?: string;
  /**
   * user or owner object on behave this job is running
   */
  owner?: any;
  /**
   * action performing using this job
   */
  action?: string;
  /**
   * files object used for upload
   */
  files?: any;
  /**
   * additional parameters used in services
   */
  payload?: any;
  /**
   * Error object or string
   */
  error?: any;
  /**
   * Log to JobLogs while running as micro service task
   * @default true
   */
  logging?: boolean;
  /**
   * Status of the job
   *
   * @default Pending
   */
  status?: 'Pending' | 'Completed' | 'Errored';
}

export class Job {
  constructor(job: Job) {
    this.app = job.app || config().appId;
    this.owner = job.owner || {
      id: null,
    };
    this.uid = job.uid || null;
    this.action = job.action || null;
    this.files = job.files || {};
    this.payload = job.payload || {};
    this.status = job.status || 'Pending';
  }
}
