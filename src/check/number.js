/**
 * 数字校验
 *
 * 字符串仅接受十进制及科学计数法字面量【如 '0x10'、' 20 '、'020' 均视为非法】
 * NaN、Infinity 等非有限数字视为非法【如 Number('Infinity') === Infinity】
 *
 * @param {*} value - The value to check.
 * @return {boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNumber('20'); // 十进制字符串
 * // => true
 *
 * isNumber('-20'); // 负号
 * // => true
 *
 * isNumber('+20'); // 正号
 * // => true
 *
 * isNumber('.2'); // 字符串缺整数位
 * // => false
 *
 * isNumber(.2); // 数字类型
 * // => true
 *
 * isNumber(1e+21); // 科学计数法数字 1000000000000000000000
 * // => true
 *
 * isNumber('1e3'); // 科学计数法字符串 1000
 * // => true
 *
 * isNumber('0x10'); // 十六进制字面量
 * // => false
 *
 * isNumber(' 20 '); // 带空白
 * // => false
 *
 * isNumber(NaN); // NaN 非有限数字
 * // => false
 *
 * isNumber(Infinity); // Infinity 非有限数字
 * // => false
 *
 * isNumber('Infinity'); // Infinity 非有限数字
 * // => false
 */
export function isNumber(value) {
  // 数字类型需排除 NaN、Infinity 等非有限数字
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (
    typeof value === 'string'
    // 白名单:普通十进制及科学计数法【Number() 还接受空白、进制字面量、前导零等,黑名单列举不全】
    && /^[+-]?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?$/.test(value)
    // '1e999' => Infinity
    && Number.isFinite(Number(value))
  ) {
    return true;
  }
  return false;
}

/**
 * 十进制数字校验
 *
 * 仅接受数字与十进制数字字面量字符串，不兼容科学计数法数字【如 '1e+21'、1e+21、[20] 均视为非法】
 * 超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400)) => Infinity】
 *
 * @param {*} value - The value to check.
 * @return {boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isDecimalNumber('20'); // 整数字符串
 * // => true
 *
 * isDecimalNumber('-20.5'); // 负小数
 * // => true
 *
 * isDecimalNumber(20.5); // 数字类型
 * // => true
 *
 * isDecimalNumber('1e3'); // 科学计数法字符串 1000
 * // => false
 *
 * isDecimalNumber(1e+21); // 科学计数法数字 1000000000000000000000
 * // => false
 *
 * isDecimalNumber('020'); // 前导零
 * // => false
 *
 * isDecimalNumber([20]); // 数组非字符串/数字
 * // => false
 *
 * isDecimalNumber('1' + '0'.repeat(400)); // Infinity
 * // => false
 */
export function isDecimalNumber(value) {
  // 正则 test 会将参数隐式转成字符串【[20] 能转成 '20' 误中】，故仅接受数字与字符串
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }
  if (!/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value)) {
    return false;
  }
  // 超长数字字面量 => Infinity
  return Number.isFinite(Number(value));
}

/**
 * 整数校验
 *
 * 仅接受数字与十进制整数字面量字符串，不兼容科学计数法数字【如 '1e+21'、1e+21、[20] 均视为非法】
 * 超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400)) => Infinity】
 *
 * @param {*} value - The value to check.
 * @return {boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isInteger('20'); // 整数字符串
 * // => true
 *
 * isInteger('-20'); // 负整数
 * // => true
 *
 * isInteger(20); // 数字类型
 * // => true
 *
 * isInteger('0.2'); // 小数非整数
 * // => false
 *
 * isInteger('020'); // 前导零
 * // => false
 *
 * isInteger([20]); // 数组非字符串/数字
 * // => false
 *
 * isInteger('1' + '0'.repeat(400)); // Infinity
 * // => false
 */
export function isInteger(value) {
  // 正则 test 会将参数隐式转成字符串【[20] 能转成 '20' 误中】，故仅接受数字与字符串
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }
  if (!/^-?(0|[1-9][0-9]*)$/.test(value)) {
    return false;
  }
  // 超长数字字面量 => Infinity
  return Number.isFinite(Number(value));
}

/**
 * 小数校验
 *
 * 仅接受数字与十进制小数字面量字符串，不兼容科学计数法数字【如 '1e-7'、1e-7、[20] 均视为非法】
 * 超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400) + '.5') => Infinity】
 *
 * @param {*} value - The value to check.
 * @return {boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isDecimal('0.2'); // 小数字符串
 * // => true
 *
 * isDecimal('-0.2'); // 负小数
 * // => true
 *
 * isDecimal(0.2); // 数字类型
 * // => true
 *
 * isDecimal('20'); // 无小数位
 * // => false
 *
 * isDecimal('00.2'); // 前导零
 * // => false
 *
 * isDecimal([0.2]); // 数组非字符串/数字
 * // => false
 *
 * isDecimal('1' + '0'.repeat(400) + '.5'); // Infinity
 * // => false
 */
export function isDecimal(value) {
  // 正则 test 会将参数隐式转成字符串【[0.2] 能转成 '0.2' 误中】，故仅接受数字与字符串
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }
  if (!/^-?(0|[1-9][0-9]*)\.[0-9]+$/.test(value)) {
    return false;
  }
  // 超长数字字面量 => Infinity
  return Number.isFinite(Number(value));
}
