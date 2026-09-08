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
 *
 * bytesToSize(1e-7); // Number 科学计数法先展开再转换
 * // => 0.0000001B
 *
 * bytesToSize(NaN); // 非有限数字
 * // => 0B
 */
import { isNumber } from '../check/number';
import expandNumber from './expandNumber';

export default function bytesToSize(bytes, digit = 1, format = '0B') {
  if (!isNumber(bytes)) {
    return format;
  }
  if (Number(bytes) <= 0) {
    return '0B';
  }
  if (bytes < 1) {
    // 先展开为十进制字符串，避免科学计数法【如 String(1e-7) === '1e-7'】
    return `${expandNumber(bytes)}B`;
  }

  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB'];
  const uLen = units.length;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // toFixed 仅接受 0-100 的整数，非法值回退默认 1【如 bytesToSize(10240, -1) 直接抛 RangeError】
  const d = Number(digit);
  const decimal = Number.isInteger(d) && d >= 0 && d <= 100 ? d : 1;

  if (i < uLen) {
    return `${(bytes / (k ** i)).toFixed(decimal)}${units[i]}`;
  }
  return `${(bytes / (k ** (uLen - 1))).toFixed(decimal)}${units[uLen - 1]}`;
}
