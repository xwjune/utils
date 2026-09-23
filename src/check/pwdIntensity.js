/**
 * 弱密码校验
 *
 * 强度分级：1-弱、2-中、3-强
 * - 位数为 6-32 位，包括 6 位或 32 位
 * - 不能包含空白字符（空格、制表符、换行等）
 * - 包含以下任意两种或以上组成元素：
 *   - ① 数字
 *   - ② 大写字母
 *   - ③ 小写字母
 *   - ④ 符号【ASCII 键盘符号】
 *
 * @param {string} value - 密码
 * @return {number} intensity - 密码强度 1-弱 | 2-中 | 3-强
 * @example
 *
 * pwdIntensity('123456'); // 纯数字，1 种元素
 * // => 1
 *
 * pwdIntensity('123456abc'); // 数字 + 小写字母，2 种元素
 * // => 2
 *
 * pwdIntensity('123456abcABC'); // 数字 + 小写 + 大写，3 种元素
 * // => 3
 *
 * pwdIntensity(' abc123ABC'); // 含空白字符
 * // => 1
 */
export default function pwdIntensity(value) {
  // 非字符串（数字、数组等）会绕过 length 校验或被正则隐式转换，直接判弱
  if (typeof value !== 'string' || !value) return 1;
  // 密码长度（按字符数计，emoji 等代理对不能按 2 位充数）
  const len = [...value].length;
  // 规则满足条数
  let rule = 0;

  /* ---------- 规则一校验 ----------*/
  // 位数为 6-32 位，包括 6 位或 32 位；
  if (len < 6 || len > 32) return 1;

  /* ---------- 规则二校验 ----------*/
  // 不能包含空白字符（空格、制表符、换行等）；
  if (/\s/.test(value)) return 1;

  /* ---------- 规则三校验 ----------*/
  // 数字
  if (/[0-9]/.test(value)) rule += 1;
  // 大写字母
  if (/[A-Z]/.test(value)) rule += 1;
  // 小写字母
  if (/[a-z]/.test(value)) rule += 1;
  // 符号：可打印 ASCII 标点全集【£、￥ 等非 ASCII 键盘符号不计入元素计数】
  if (/[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/.test(value)) rule += 1;

  switch (rule) {
    case 0:
    case 1:
      // 弱：规则一、二已在前置 return 中通过，仅命中不足两种元素
      return 1;
    case 2:
      // 中：规则一、二已通过，恰命中两种元素
      return 2;
    default:
      // 强：规则一、二已通过，命中三种及以上元素
      return 3;
  }
}
