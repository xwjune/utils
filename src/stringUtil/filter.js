/**
 * 空数据过滤
 *
 * @param {string} str - 字符串
 * @param {string} [format=''] - 格式化
 * @return {string} 过滤后的数据
 * @example
 *
 * filterNull('xxx');
 * // => xxx
 *
 * filterNull();
 * // =>
 *
 * filterNull(null, '--');
 * // => --
 */
import isNull from '../check/isNull';

export function filterNull(str, format = '') {
  if (isNull(str)) {
    return format;
  }
  return str;
}
