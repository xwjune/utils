/**
 * 邮编校验
 * 规则：6位数字
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 *
 * postcode('310000');
 * // => true
 */
export default function postcode(value) {
  return /^\d{6}$/.test(value);
}
