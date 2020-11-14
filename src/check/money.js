/**
 * 金额【元】判断
 * 规则：数字，最多两位小数
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * money('-20');
 * // => false
 *
 * money('20.00');
 * // => true
 *
 * money('20.002');
 * // => false
 *
 * money('002');
 * // => false
 */
export default function money(value) {
  return /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/.test(value);
}
