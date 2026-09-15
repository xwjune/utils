/**
 * 邮编校验
 *
 * 规则：6 位数字【前导零合法，如内蒙 010000、河北 050000】
 *
 * @param {*} value - The value to check.
 * @return {boolean} Return `true` if validated, else `false`.
 * @example
 *
 * postcode('310000'); // 常规 6 位
 * // => true
 *
 * postcode('010000'); // 前导零合法，内蒙 010000、河北 050000
 * // => true
 *
 * postcode('3100000'); // 7 位不符 6 位
 * // => false
 *
 * postcode(['310000']); // 数组非字符串
 * // => false
 */
export default function postcode(value) {
  // 正则 test 会将参数隐式转成字符串【数字、单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return /^\d{6}$/.test(value);
}
