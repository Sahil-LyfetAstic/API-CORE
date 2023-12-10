/**
 * The Base Error all App Errors inherit from.
 */
export class BaseError extends Error {
  public name: string;
}

/**
 * Thrown when a record was not found
 */
export class NotFoundError extends BaseError {}

/**
 * Thrown when a record was not found
 */
export class ValidationError extends BaseError {}

export interface UploadExceptionOptions {
  message: string;
  field: string;
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
  };
}

/**
 * Thrown when upload failed
 */
export class UploadException extends Error {
  public field: string;
  public file: UploadExceptionOptions['file'];
  constructor(options: UploadExceptionOptions) {
    super();
    this.message = options.message || 'Upload Error';
    this.field = options.field;
    this.file = options.file;
  }
}
