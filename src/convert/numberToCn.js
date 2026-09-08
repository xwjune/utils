/**
 * 阿拉伯数字转中文
 * 处理数字小于1000000000000【壹万亿】
 *
 * 多位数读法原则【按照四位分级的原则】：
 * 1. 四位以内的数，按照数位顺序，从高位读起．
 * 2. 四位以上的数，先从右向左四位分级，然后从最高级起，依次读亿级、万级、个级。读出各级里的数和它们的级名。
 *    每一级的读法和个级的读法相同。
 *    亿级里的数，按照个级的数的读法来读，再在后面加上一个“亿”字；万级里的数，按照个级的数的读法来读，再在后面加上一个“万”字；
 * 3. 每级末尾不管有几个“0”，都不读；其他数位上有一个“0”或几个“0”，都只读一个零。
 *
 * @param {Number} value - 阿拉伯数字
 * @returns {String} 中文数字
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
  // 边界值校验【整数部分超过12位即大于等于壹万亿】
  // 不用 Number(value) >= 1000000000000 判断：字符串转双精度浮点会舍入，
  // 如 '999999999999.9999999999999999999' 实际小于壹万亿，却进位到1000000000000而被误判超大；
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
