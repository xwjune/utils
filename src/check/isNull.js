/**
 * 空数据校验
 * 空数据集合：undefined, null, ''
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNull();
 * // => true
 *
 * isNull(null);
 * // => true
 *
 * isNull('');
 * // => true
 */
export default function isNull(value) {
  if (
    value === undefined
    || value === null
    || value === ''
  ) {
    return true;
  }
  return false;
}
