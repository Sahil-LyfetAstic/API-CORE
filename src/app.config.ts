export enum AppEngine {
  SQL = 'sql',
  Mongo = 'mongo',
}

/**
 * @variable {AppEngine} defaultEngine
 * Default engine
 * @default mongo
 */
export const defaultEngine: AppEngine =
  (process.env.APP_ENGINE as AppEngine) || AppEngine.SQL;

/**
 * @variable {string} APP_NAME
 * Name of the application
 */
export const APP_NAME = 'CyberCore Framework';

/**
 * @variable {number} APP_VERSION
 * Latest version of the application
 * @default 1
 */
export const APP_VERSION = 1;

/**
 * @variable {number} APP_MIN_VERSION
 * Minimum supported version of the application
 * @default 1
 */
export const APP_MIN_VERSION = 1;
