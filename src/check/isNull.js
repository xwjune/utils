/**
 * 空数据校验
 *
 * 空数据集合：undefined, null, ''
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNull(); // 缺省即 undefined
 * // => true
 *
 * isNull(null); // null
 * // => true
 *
 * isNull(''); // 空字符串
 * // => true
 */
export default function isNull(value) {
  return value === undefined
    || value === null
    || value === '';
}
