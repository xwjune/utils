/**
 * 数字千位符分隔
 *
 * @param {Number} value - 数字
 * @param {String} [format=''] - 格式化
 * @returns {String}
 * @example
 *
 * toThousands('12345678')
 * // => 12,345,678
 *
 * toThousands('12345678.90')
 * // => 12,345,678.90
 */
import { isNumber } from '../check/number';

export default function toThousands(value, format = '') {
  if (!isNumber(value)) {
    return format;
  }
  let str = value.toString();
  const regExp = new RegExp('^(-?[0-9]+)([0-9]{3})');
  while (regExp.test(str)) {
    str = str.replace(regExp, '$1,$2');
  }
  return str;
}

// function toThousands(value, format = '') {
//   const n = Number(value); // Number()、Nubmer('')、Number(null) => 0，Number(undefined) => NaN
//   if (value === '' || value === null || Number.isNaN(n)) {
//     return format;
//   }
//   let str = n.toString();
//   const regExp = new RegExp('^(-?[0-9]+)([0-9]{3})');
//   while (regExp.test(str)) {
//     str = str.replace(regExp, '$1,$2');
//   }
//   return str;
// }
