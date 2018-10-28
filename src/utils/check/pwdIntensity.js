/**
 * 弱密码校验
 *
 *（1）位数为6-32位，包括6位或32位
 *（2）包含以下任意两种或以上组成元素：
 *    ① 数字
 *    ② 大写字母
 *    ③ 小写字母
 *    ④ 符号【键盘上可以打出来的符号】
 *
 * @param {String} pwd - 密码
 * @return {Number} intensity - 密码强度 1-弱|2-中|3-强
 * @example
 *
 * pwdIntensity('123456');
 * // => 1
 *
 * pwdIntensity('123456abc');
 * // => 2
 */
export default function (pwd = '') {
  // 密码长度
  const len = pwd.length;
  // 规则满足条数
  let rule = 0;

  /* ---------- 规则一校验 ----------*/
  // 位数为6-32位，包括6位或32位；
  if (len < 6 || len > 32) return 1;

  /* ---------- 规则二校验 ----------*/
  // 数字
  if (/\d/g.test(pwd)) rule += 1;
  // 大写字母
  if (/[A-Z]/g.test(pwd)) rule += 1;
  // 小写字母
  if (/[a-z]/g.test(pwd)) rule += 1;
  // 包含以下特殊符号
  if (/(`|~|!|@|#|\$|%|\^|&|\*|\(|\)|-|_|\+|=|\{|\}|\[|\]|:|;|'|"|<|>|,|\.|\?|\/|\||\\)/.test(pwd)) rule += 1;

  switch (rule) {
  case 0:
  case 1:
    // 弱：非有效密码，即没有同时满足有效定义的（1）和（2）
    return 1;
  case 2:
    // 中：有效密码，即满足了有效定义的（1），以及（2）中的任意两种组合
    return 2;
  default:
    // 强：有效密码，即满足了有效定义的（1），以及（2）中的任意三种组合或所有
    return 3;
  }
}
