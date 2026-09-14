/**
 * 身份证校验
 *
 * 一代身份证【15 位】：地址码【六位】出生日期码【六位】数字顺序码【三位】
 * 二代身份证【18 位】：地址码【六位】出生日期码【八位】数字顺序码【三位】数字校验码【一位】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * idCard('330000199001017865'); // 常规二代身份证
 * // => true
 *
 * idCard('33000019900101746x'); // 校验码 X 不区分大小写
 * // => true
 *
 * idCard('330000900101786'); // 常规一代身份证
 * // => true
 *
 * idCard('330000199001017866'); // 校验码错误
 * // => false
 *
 * idCard('330000199002311230'); // 2月31日不存在
 * // => false
 */

// 出生月份 (0[1-9]|1[0-2])、出生日期 (0[1-9]|[1-2]\d|3[0-1]) 两代同构；
// 日期段只是结构粗筛【0231、平年 0229 这类真实日历由下方 isValidDate 另验】
// 一代身份证（15 位，无校验码）：地址码 [1-9]\d{5} + 两位出生年份【实际年份固定补 19】+ 月日 + 3 位顺序码
const PATTERN_15 = /^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}$/;
// 二代身份证（18 位）：地址码 [1-9]\d{5} + 出生年份 [1-9]\d{3} + 月日 + 3 位顺序码 + 末位校验码【X 不区分大小写】
const PATTERN_18 = /^[1-9]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dX]$/i;
// 二代校验码加权因子【ISO 7064 MOD 11-2，即 2^17…2^1 对 11 取模的循环】
const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
// 模 11 余数 -> 校验码
const CHECK_CODES = '10X98765432';

// 真实日历日期校验【2月30日、平年2月29日这类月日联合规则，正则表达不了】
function isValidDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
}

export default function idCard(value) {
  // 正则 test 会将参数隐式转成字符串【数字、单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;

  if (PATTERN_18.test(value)) {
    // 正则只保结构，真实日期与校验码另验
    if (!isValidDate(+value.slice(6, 10), +value.slice(10, 12), +value.slice(12, 14))) return false;
    // 前 17 位加权求和模 11，映射出期望校验码，与末位比对
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += +value[i] * WEIGHTS[i];
    }
    return CHECK_CODES[sum % 11] === value[17].toUpperCase();
  }

  if (PATTERN_15.test(value)) {
    // 一代证出生年份只有两位，实际年份固定补 19
    return isValidDate(1900 + +value.slice(6, 8), +value.slice(8, 10), +value.slice(10, 12));
  }

  return false;
}
