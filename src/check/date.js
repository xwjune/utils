/**
 * 日期校验
 * 规则：YYYY-MM-DD 或 YYYY/MM/DD【年 4 位，月日各 2 位且补零，分隔符须前后一致】
 * 且日历日期须真实存在【闰年 2 月 29 日、大小月 31 日等月日联合规则】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * date('2024-02-29');
 * // => true
 *
 * date('2024/02/29');
 * // => true
 *
 * date('2023-02-29');
 * // => false
 */
// 结构：年 4 位，月 01-12，日 01-31，分隔符用反向引用锁定前后一致【2024-02/29 不通过】
const REGEXP = /^(\d{4})([-/])(0[1-9]|1[0-2])\2(0[1-9]|[12]\d|3[01])$/;
// 平年各月天数【下标即月份 - 1，闰年 2 月另加】
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function date(value) {
  if (typeof value !== 'string') return false;
  const match = REGEXP.exec(value);
  if (!match) return false;
  // 正则只保结构，月日联合规则另验；不借 Date 回读：
  // 构造函数对 0-99 年隐加 1900【new Date(4,1,29) 回读成 1904】，手算最稳
  const year = +match[1]; // 一元运算符，+x等价于Number(x)
  const month = +match[3];
  const day = +match[4];
  // 闰年：四年一闰、百年不闰、四百年再闰
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  // 该月天数上限：闰年 2 月从 28 提到 29，其余查表【下标 = 月份 - 1】
  const maxDay = month === 2 && leap ? 29 : MONTH_DAYS[month - 1];
  // 日不超该月上限，即日历上真实存在
  return day <= maxDay;
}

/**
 * 常用日期校验
 * 规则：YYYY-MM-DD 或 YYYY/MM/DD【年 1000-9999，月日各 2 位且补零，分隔符须前后一致】
 * 且日历日期须真实存在【闰年 2 月 29 日、大小月 31 日等月日联合规则】
 * 全量 0000-9999 年请用 date【本方法下界 1000，年 1000 前的 ISO 日期不收】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * commonDate('2024-02-29');
 * // => true
 *
 * commonDate('0999-12-31');
 * // => false
 */
// 结构同 REGEXP，仅年限首位非 0【即 1000-9999】
const REGEXP_COMMON = /^([1-9]\d{3})([-/])(0[1-9]|1[0-2])\2(0[1-9]|[12]\d|3[01])$/;

export function commonDate(value) {
  if (typeof value !== 'string') return false;
  const match = REGEXP_COMMON.exec(value);
  if (!match) return false;
  // 正则只保结构，月日联合规则另验；此处用 new Date 回读是安全的：
  // 年已限 1000 起，避开了 0-99 年隐加 1900 的坑【new Date(4,1,29) 回读成 1904】
  const year = +match[1]; // 一元运算符，+x等价于Number(x)
  const month = +match[3];
  const day = +match[4];
  // 月份 0 起算故 -1；构造对超上限的日会滚入下月【'2023-02-30' 成 3 月 2 日】
  const d = new Date(year, month - 1, day);
  // 回读三字段逐一比对，任一对不上即该日不存在
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}
