/**
 * 手机校验
 * 规则：11位数字，首位1
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * cellphone('13456789012');
 * // => true
 */

// 手机号：首位 1，后接 10 位数字
const CELLPHONE_REGEXP = /^1\d{10}$/;

export function cellphone(value) {
  // 正则 test 会将参数隐式转成字符串【数字、单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return CELLPHONE_REGEXP.test(value);
}

/**
 * 固定电话校验
 * 规则：3-4位区号，7-8位直拨号码
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * telphone('0571-85735888');
 * // => true
 *
 * telphone('057185735888');
 * // => true
 *
 * telphone('85735888');
 * // => true
 */

// 固定电话：区号 3-4 位，可带一个连字符；区号整体可省，直拨号码 7-8 位
const TELPHONE_REGEXP = /^(\d{3,4}-?)?\d{7,8}$/;

export function telphone(value) {
  // 正则 test 会将参数隐式转成字符串【数字、单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return TELPHONE_REGEXP.test(value);
}

/**
 * 电话【手机和固定电话】校验
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * phone('057185735888');
 * // => true
 *
 * phone('13456789012');
 * // => true
 */
export function phone(value) {
  return cellphone(value) || telphone(value);
}
