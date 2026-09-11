/**
 * ip地址校验（IPv4）
 * 四段 0-255 以点分隔【拒绝前导零，如 01.1.1.1 不通过】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * ip('192.168.0.1');
 * // => true
 *
 * ip('127.256.27.1');
 * // => false
 */

// 每段 0-255 的推导，按区间组成特点分写：
// 250-255：百位 2、十位 5、个位 0~5 → 25[0-5]
// 200-249：百位 2、十位 0~4、个位 0~9 → 2[0-4]\d
// 0-199 继续分拆写起来更简单明了：
//   0-9 一位数 → \d；10-99 十位 1~9 → [1-9]\d；100-199 百位 1 → 1\d{2}
//   0-99 合写为 [1-9]?\d，故 0-199 即 1\d{2}|[1-9]?\d
// 三区间并列即每段：25[0-5]|2[0-4]\d|(1\d{2}|[1-9]?\d)
const OCTET = '(25[0-5]|2[0-4]\\d|(1\\d{2}|[1-9]?\\d))';
const REGEXP = new RegExp(`^(${OCTET}\\.){3}${OCTET}$`);

export default function ip(value) {
  // 正则 test 会将参数隐式转成字符串【单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return REGEXP.test(value);
}
