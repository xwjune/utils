/**
 * 数字千位符分隔
 *
 * @param {Number} value - 数字
 * @returns {String}
 * @example
 *
 * toThousands('12345678')
 * // => 12,345,678
 *
 * toThousands('12345678.90')
 * // => 12,345,678.90
 *
 * toThousands(1e+21)
 * // => 1,000,000,000,000,000,000,000
 *
 * toThousands('+2000')
 * // => 2,000
 */
import { isNumber } from '../check/number';
import expandNumber from './expandNumber';

export default function toThousands(value) {
  if (!isNumber(value)) {
    return '';
  }
  // 先展开科学计数法【如 String(1e-7) => '1e-7'】，再规范化前导 + 号【如 '+2000' => '2000'】
  let str = expandNumber(value).replace(/^\+/, '');
  const regExp = new RegExp('^(-?[0-9]+)([0-9]{3})');
  while (regExp.test(str)) {
    str = str.replace(regExp, '$1,$2');
  }
  return str;
}
