/**
 * 数据容量单位换算
 *
 * @param {Number} bytes - 数据容量
 * @param {Number} [digit=1] - 保留小数位数
 * @param {String} [format='0B'] - 格式化
 * @returns {String}
 * @example
 *
 * bytesToSize(10240);
 * // => 10.0KB
 *
 * bytesToSize(1024 * 1024, 2);
 * // => 1.00MB
 *
 * bytesToSize('32g');
 * // => 0B
 */
import { isNumber } from '../check/number';

export default function bytesToSize(bytes, digit = 1, format = '0B') {
  if (!isNumber(bytes)) {
    return format;
  }
  if (Number(bytes) === 0 || bytes < 0) {
    return '0B';
  }
  if (bytes < 1) {
    return `${bytes}B`;
  }

  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB'];
  const uLen = units.length;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i < uLen) {
    return `${(bytes / (k ** i)).toFixed(digit)}${units[i]}`;
  }
  return `${(bytes / (k ** (uLen - 1))).toFixed(digit)}${units[uLen - 1]}`;
}
