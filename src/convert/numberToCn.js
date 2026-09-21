/**
 * 阿拉伯数字转中文
 *
 * 处理数字小于 1000000000000【壹万亿】；小数「点」后逐位读，末尾 0 原样保留。读法规则：
 * - 分级：按个/万/亿数级分段，每级按个级读法读出后缀级名
 * - 读「零」：数位中间的 0 读一个「零」（连续 0 合并）
 * - 省「零」：数级末尾的 0 不读；万级全为 0 时连级名「万」一并省略
 *
 * @param {number} value - 阿拉伯数字
 * @returns {string} 中文数字
 * @example
 *
 * numberToCn(0.01);
 * // => 零点零壹
 *
 * numberToCn(100);
 * // => 壹佰
 *
 * numberToCn(1008); // 中间的零只读一个
 * // => 壹仟零捌
 *
 * numberToCn(10008000); // 万级末尾的零不读
 * // => 壹仟万捌仟
 *
 * numberToCn(100000800); // 万级全为零，级名不读
 * // => 壹亿零捌佰
 *
 * numberToCn(100008000); // 个级开头的零要读
 * // => 壹亿零捌仟
 *
 * numberToCn('12x');
 * // => 数据错误
 *
 * numberToCn(1000000000000); // 达到壹万亿
 * // => 超大数字
 */
import expandNumber from './expandNumber';

export default function numberToCn(value) {
  // Number 先展开为十进制字符串，避免科学计数法【如 String(1e-7) === '1e-7'】被误判为数据错误
  const str = typeof value === 'number' ? expandNumber(value) : value;
  if (!/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(str)) {
    return '数据错误';
  }

  const [
    integral, // 整数部分
    decimal, // 小数部分
  ] = str.split('.');
  // 边界值校验【整数部分超过 12 位即大于等于壹万亿】
  // 不用 Number(value) >= 1000000000000 判断：字符串转双精度浮点会舍入，
  // 如 '999999999999.9999999999999999999' 实际小于壹万亿，却进位到 1000000000000 而被误判超大；
  // 按整数位数判断则完全精确
  if (integral.length > 12) {
    return '超大数字';
  }

  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 中文数字
  const radices = ['', '拾', '佰', '仟']; // 基本单位
  const bigRadices = ['', '万', '亿']; // 数级单位
  const point = '点';
  let result = ''; // 返回值

  // Process integral part:
  if (Number(integral) > 0) {
    let zeroCount = 0;
    for (let i = 0, intLen = integral.length; i < intLen; i++) {
      const d = integral[i]; // 当前数字
      const p = intLen - i - 1; // 当前数字索引
      const m = p % 4; // 取模
      if (d === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          result += digits[0]; // 多个零合并显示
        }
        zeroCount = 0;
        result += digits[Number(d)] + radices[m];
      }
      // 数级单位处理【若当前数级值为零，数级单位不读取】
      if (m === 0 && zeroCount < 4) {
        result += bigRadices[p / 4];
        zeroCount = 0;
      }
    }
  } else {
    result += digits[0];
  }

  // Process decimal part:
  if (decimal !== undefined) {
    result += point;
    for (let i = 0, decLen = decimal.length; i < decLen; i++) {
      const d = decimal[i]; // 当前数字
      result += digits[Number(d)];
    }
  }

  return result;
}

// 0 零
// 0.01 零点零壹
// 0.10 零点壹零【小数末尾的零原样保留】
// 1 壹
// 10 壹拾
// 1008 壹仟零捌【中间的零只读一个】
// 1080 壹仟零捌拾【末尾的零不读】
// 10000 壹万
// 10008 壹万零捌
// 10008000 壹仟万捌仟【万级末尾的零不读】
// 10000800 壹仟万零捌佰【个级开头的零要读】
// 100000000 壹亿
// 100000008 壹亿零捌【万级全为零，级名不读】
// 1000000001 壹拾亿零壹
// 999999999999.99 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖点玖玖
// 0.0000001 零点零零零零零零壹
// 1000000000000 超大数字
// -12 数据错误
