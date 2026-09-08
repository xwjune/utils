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
 * 仅接受数字及十进制字面量，不兼容科学计数法数字【如 '1e+21'、1e+21、[20] 均视为非法】
 * 超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400)) => Infinity】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isDecimalNumber('20');
 * // => true
 *
 * isDecimalNumber('-20.5');
 * // => true
 *
 * isDecimalNumber(20.5);
 * // => true
 *
 * isDecimalNumber('1e3');
 * // => false
 *
 * isDecimalNumber(1e+21); // String(1e+21) => '1e+21'
 * // => false
 *
 * isDecimalNumber('020');
 * // => false
 *
 * isDecimalNumber([20]);
 * // => false
 *
 * isDecimalNumber('1' + '0'.repeat(400)); // Infinity
 * // => false
 */
export function isDecimalNumber(value) {
  // test 会先将参数隐式转成字符串【[20] => '20' 亦能匹配正则】，故仅接受数字与字符串
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
 * 仅接受数字及十进制整数字面量，不兼容科学计数法数字【如 '1e+21'、1e+21、[20] 均视为非法】
 * 超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400)) => Infinity】
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
 *
 * isInteger([20]);
 * // => false
 *
 * isInteger('1' + '0'.repeat(400)); // Infinity
 * // => false
 */
export function isInteger(value) {
  // test 会先将参数隐式转成字符串【[20] => '20' 亦能匹配正则】，故仅接受数字与字符串
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
 * 仅接受数字及十进制小数字面量，不兼容科学计数法数字【如 '1e-7'、1e-7、[20] 均视为非法】
 * 超出双精度表示范围的字面量视为非法【Number('1' + '0'.repeat(400) + '.5') => Infinity】
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
 *
 * isDecimal([0.2]);
 * // => false
 *
 * isDecimal('1' + '0'.repeat(400) + '.5'); // Infinity
 * // => false
 */
export function isDecimal(value) {
  // test 会先将参数隐式转成字符串【[0.2] => '0.2' 亦能匹配正则】，故仅接受数字与字符串
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }
  if (!/^-?(0|[1-9][0-9]*)\.[0-9]+$/.test(value)) {
    return false;
  }
  // 超长数字字面量 => Infinity
  return Number.isFinite(Number(value));
}
