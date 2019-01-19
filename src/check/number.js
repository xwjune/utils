/**
 * 数字校验
 *
 * @param {*} value - The value to check.
 * @param {Boolean} [scientific=true] - 是否排除科学计数法数字【true-不排除，false-排除】
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
 *
 * isNumber(.2);
 * // => true
 *
 * isNumber(9.007199254740992e+21, false);
 * // => false
 */
export function isNumber(value, scientific = true) {
  if (typeof value === 'number') {
    return scientific ? true : !/e\+[0-9]+$/.test(value);
  }
  if (typeof value === 'string') {
    // 已排除数据02、002等
    return /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value);
  }
  return false;
}

/**
 * 整数校验
 * 不兼容科学计数法数字
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
  return /^-?(0|[1-9][0-9]*)$/.test(value);
}

/**
 * 小数校验
 * 不兼容科学计数法数字
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
  return /^-?(0|[1-9][0-9]*)\.[0-9]+$/.test(value);
}
