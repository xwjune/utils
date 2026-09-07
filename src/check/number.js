/**
 * 数字校验
 * 字符串仅接受十进制及科学计数法字面量【如 '0x10'、' 20 '、'020' 均视为非法】
 * NaN、Infinity 等非有限数字视为非法【如 Number('Infinity') === Infinity】
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
 * isNumber('+20');
 * // => true
 *
 * isNumber('.2');
 * // => false
 *
 * isNumber(.2);
 * // => true
 *
 * isNumber(1e+21); // 1000000000000000000000
 * // => true
 *
 * isNumber('1e3');
 * // => true
 *
 * isNumber('0x10');
 * // => false
 *
 * isNumber(' 20 ');
 * // => false
 *
 * isNumber(NaN);
 * // => false
 *
 * isNumber(Infinity);
 * // => false
 *
 * isNumber('Infinity');
 * // => false
 */
export function isNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (
    typeof value === 'string'
    // 白名单:普通十进制及科学计数法【Number() 还接受空白、进制字面量、前导零等,黑名单列举不全】
    && /^[+-]?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?$/.test(value)
    && Number.isFinite(Number(value)) // '1e999' => Infinity
  ) {
    return true;
  }
  return false;
}
// 正则表达式
// export function isNumber(value) {
//   return !/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value);
// }

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
