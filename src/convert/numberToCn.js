/**
 * 阿拉伯数字转中文
 * 处理数字不超过1000000000000【壹万亿】
 *
 * 多位数读法原则【按照四位分级的原则】：
 * 1. 四位以内的数，按照数位顺序，从高位读起．
 * 2. 四位以上的数，先从右向左四位分级，然后从最高级起，依次读亿级、万级、个级。读出各级里的数和它们的级名。
 *    每一级的读法和个级的读法相同。
 *    亿级里的数，按照个级的数的读法来读，再在后面加上一个“亿”字；万级里的数，按照个级的数的读法来读，再在后面加上一个“万”字；
 * 3. 每级末尾不管有几个“0”，都不读；其他数位上有一个“0”或几个“0”，都只读一个零。
 *
 * @param {Number} value - 阿拉伯数字
 * @returns {string} 中文数字
 */
import { isNumber } from '../check/number';

export default function numberToCn(value) {
  if (!isNumber(value, false) || Number(value) < 0) {
    return '数据错误';
  }

  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 中文数字
  const radices = ['', '拾', '佰', '仟']; // 基本单位
  const bigRadices = ['', '万', '亿']; // 数级单位
  const point = '点';
  const maxNum = 1000000000000; // 边界值【小于壹万亿】
  let integral = ''; // 整数部分
  let decimal = ''; // 小数部分
  let result = ''; // 返回值

  value = value.toString();
  if (Number(value) >= maxNum) {
    return '超大数字';
  }
  if (value.indexOf('.') === -1) {
    integral = value;
  } else {
    [integral, decimal] = value.split('.');
  }

  // Process integral part:
  if (Number(integral) > 0) {
    let zeroCount = 0;
    for (let i = 0, intLen = integral.length; i < intLen; i++) {
      const d = integral[i]; // 当前数字
      const p = intLen - i - 1; // 当前数字索引
      const m = p % 4; // modulus
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
  if (decimal !== '') {
    result += point;
    for (let i = 0, decLen = decimal.length; i < decLen; i++) {
      const d = decimal[i]; // 当前数字
      result += digits[Number(d)];
    }
  }

  return result;
}
