export const EXCLUDE_TRIM_FIELDS_KEY = 'exclude_trim_fields';

/**
 * Decorator for excluding fields from global TrimPipe
 *
 * Exclude all fields
 *```js
 * @ExcludeTrim()
 * ```
 * OR
 *
 * Exclude specific fields
 * ```js
 * @ExcludeTrim('field_1')
 * ```
 */
export function ExcludeTrim(...fields: string[]) {
  return function (constructor: any) {
    constructor.prototype[EXCLUDE_TRIM_FIELDS_KEY] = fields.length
      ? fields
      : true;
  };
}
