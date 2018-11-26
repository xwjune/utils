/**
 * 空数据校验
 * 空数据集合：undefined,'undefined',null,'null','(null)','NaN',''
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNull();
 * // => true
 *
 * isNull('undefined');
 * // => true
 */
export default function isNull(value) {
  if (
    typeof value === 'undefined'
    || value === 'undefined'
    || value === null
    || value === 'null'
    || value === '(null)'
    || value === 'NaN'
    || value === ''
  ) {
    return true;
  }
  return false;
}
