/**
 * 数字千位符分隔
 *
 * @param {number|string} value - 数字
 * @param {string} [format=''] - 空数据格式化
 * @returns {string}
 * @example
 *
 * toThousands('12345678');
 * // => 12,345,678
 *
 * toThousands('12345678.90');
 * // => 12,345,678.90
 *
 * toThousands(1e+21); // 科学计数法先展开
 * // => 1,000,000,000,000,000,000,000
 *
 * toThousands('+2000'); // 前导 + 号规范化
 * // => 2,000
 *
 * toThousands('0.5e5'); // 前导零规范化
 * // => 50,000
 *
 * toThousands(); // 空数据返回空串
 * // => ''
 *
 * toThousands(undefined, '--'); // 空数据格式化
 * // => --
 *
 * toThousands('x12'); // 错误数据返回空串
 * // => ''
 */
import isNull from '../check/isNull';
import { isNumber } from '../check/number';
import expandNumber from './expandNumber';

export default function toThousands(value, format = '') {
  if (isNull(value)) {
    return format;
  }
  // 错误数据
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
