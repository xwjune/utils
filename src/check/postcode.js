/**
 * 邮编校验
 * 规则：6位数字【前导零合法，如内蒙 010000、河北 050000】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 *
 * postcode('310000');
 * // => true
 */
export default function postcode(value) {
  // test 会将参数隐式转成字符串【单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return /^\d{6}$/.test(value);
}
