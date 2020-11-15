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
 */
import { isNumber } from '../check/number';

export default function toThousands(value) {
  if (!isNumber(value)) {
    return '';
  }
  let str = value.toString();
  const regExp = new RegExp('^(-?[0-9]+)([0-9]{3})');
  while (regExp.test(str)) {
    str = str.replace(regExp, '$1,$2');
  }
  return str;
}

// function toThousands(value) {
//   const n = Number(value); // Number()、Nubmer('')、Number(null) => 0，Number(undefined) => NaN
//   if (value === '' || value === null || Number.isNaN(n)) {
//     return '';
//   }
//   let str = n.toString();
//   const regExp = new RegExp('^(-?[0-9]+)([0-9]{3})');
//   while (regExp.test(str)) {
//     str = str.replace(regExp, '$1,$2');
//   }
//   return str;
// }
