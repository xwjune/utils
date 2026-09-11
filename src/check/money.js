/**
 * 金额【元】判断
 * 规则：非负、最多两位小数
 * 仅接受数字及十进制字面量【如 '-20'、'002'、[20]、1e-7、NaN 均视为非法】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * money('20.00');
 * // => true
 *
 * money(20.5);
 * // => true
 *
 * money('-20');
 * // => false
 *
 * money('20.002');
 * // => false
 *
 * money('002');
 * // => false
 *
 * money(1e-7); // String(1e-7) => '1e-7'
 * // => false
 */

// 整数部分：0 或无前导零的正整数；小数部分：可选，1-2 位数字
const REGEXP = /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/;

export default function money(value) {
  // 正则 test 会将参数隐式转成字符串【[20] 能转成 '20' 误中】，故仅接受数字与字符串
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }
  return REGEXP.test(value);
}
