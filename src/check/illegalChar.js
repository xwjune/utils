/**
 * 非法字符校验
 * 非法字符集：
 *   双引号（"）、反斜杠（\）
 *   回车（\r）、换行（\n）、制表（\t）、垂直制表（\v）、换页（\f）、空字符（\0）
 *   以及其余控制字符（0x00-0x1F 与 0x7F 全集）
 * 空格（0x20）不在集合内，合法
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if an illegal char is found, else `false`.
 * @example
 *
 * illegalChar('123\n123');
 * // => true
 *
 * illegalChar('123');
 * // => false
 */

// \x00-\x1f 为 C0 控制符全集（\0=0x00 \t=0x09 \n=0x0A \v=0x0B \f=0x0C \r=0x0D 均落在区间内），\x7f 为 DEL
// eslint-disable-next-line no-control-regex
const REGEXP = /["\\\x00-\x1f\x7f]/;

export default function illegalChar(value) {
  // 正则 test 会将参数隐式转成字符串【非锚定匹配，数组、对象能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return REGEXP.test(value);
}
