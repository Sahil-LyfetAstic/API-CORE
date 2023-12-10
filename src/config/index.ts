import { join } from 'path';

import { CacheManagerOptions } from '@nestjs/common';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_NAME } from 'src/app.config';

export enum CDNStorage {
  Local,
  Aws,
  Azure,
}

export enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export default () => ({
  /**
   * @property {Environment} env - environment
   * @default development
   */
  env: process.env.NODE_ENV || Environment.Development,
  /**
   * @property {number} port
   * @default 3000
   */
  port: parseInt(process.env.PORT, 10) || 3000,
  /**
   * @property {string} appName - app name
   */
  appName: APP_NAME,
  /**
   * @property {string} appId - app unique id
   */
  appId: process.env.npm_package_name,
  /**
   * @property {string} appVersion - app version
   */
  appVersion: '1.0',
  /**
   * @property {string} baseURL - app base url or domain
   * @default http://localhost:{port}/
   */
  baseURL:
    process.env.BASE_URL ||
    `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/`,
  /**
   * @property {boolean} cdnStatic
   * Serve a static folder inside app, set to false if not required (when using s3 or any other services)
   * @default true
   */
  cdnStatic: true,
  /**
   * @property {CDNStorage} cdnStorage
   * Default CDN storage, eg: Local Drive, Aws S3, Azure Storage, etc
   * @default 0 (Local Storage)
   */
  cdnStorage: CDNStorage.Local,
  /**
   * @property {string} cdnPath
   * Path to serve static, by default it will use public/ folder
   */
  cdnPath: join(__dirname, '..', 'public'),
  /**
   * @property {string} cdnServeRoot
   * Prefix to serve static url, when using /cdn as value public files will be available at http://localhost:{port}/cdn/
   * @default cdn/
   */
  cdnServeRoot: '/cdn',
  /**
   * @property {string} cdnURL
   * Serve static url, when using /cdn as value public files will be available at http://localhost:{port}/cdn/
   */
  cdnURL:
    process.env.CDN_URL ||
    (process.env.BASE_URL ||
      `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/`) + 'cdn/',
  /**
   * @property {string} cdnLocalURL
   * Serve static url, when using /cdn as value public files will be available at http://localhost:{port}/cdn/
   */
  cdnLocalURL:
    (process.env.BASE_URL ||
      `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/`) + 'cdn/',
  /**
   * @property {boolean} useSocketIO
   * Enable Socket IO
   * @default true
   */
  useSocketIO: true,
  /**
   * @property {number} paginationLimit
   * Default pagination limit
   * @default 10
   */
  paginationLimit: 10,
  /**
   * @property {ThrottlerModuleOptions} throttler
   * Rate Limiting configuration
   */
  throttler: <ThrottlerModuleOptions>{
    ttl: 60,
    limit: 10,
  },
  /**
   * @property {CacheManagerOptions} cache
   * Cache configuration
   */
  cache: <CacheManagerOptions>{
    ttl: 60,
  },
});
