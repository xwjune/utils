/**
 * 数字校验
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNumber('20');
 * // => true
 *
 * isNumber('-20');
 * // => true
 *
 * isNumber('.2');
 * // => false
 */
export function isNumber(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

/**
 * 整数校验
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isInteger('20');
 * // => true
 *
 * isInteger('-20');
 * // => true
 *
 * isInteger('0.2');
 * // => false
 *
 * isInteger('020');
 * // => false
 */
export function isInteger(value) {
  return /^-?(\d|[1-9]\d+)$/.test(value);
}

/**
 * 小数校验
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isDecimal('0.2');
 * // => true
 *
 * isDecimal('-0.2');
 * // => true
 *
 * isDecimal('20');
 * // => false
 *
 * isDecimal('00.2');
 * // => false
 */
export function isDecimal(value) {
  return /^-?(\d|[1-9]\d+)\.\d+$/.test(value);
}
