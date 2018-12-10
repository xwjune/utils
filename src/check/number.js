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
 */
export function isNumber(value) {
  if (typeof value === 'number') {
    return true;
  }
  if (
    typeof value === 'string'
    && value !== ''
    && !/^\./.test(value) // 排除数据 .x【.2、.3】
    && !/\.$/.test(value) // 排除数据 x.【2.、3.】
    && !/^0[^.]/.test(value) // 排除数据02、002等
    && !Number.isNaN(Number(value))
  ) {
    return true;
  }
  return false;
}

/**
 * 整数校验
 * 不兼容科学计数法的数字
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
 * 不兼容科学计数法的数字
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
  return /^-?(0|[1-9][0-9]*)\.\d+$/.test(value);
}
