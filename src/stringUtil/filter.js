import isNull from '../check/isNull';

/**
 * 空数据过滤
 *
 * @param {String} str - 字符串
 * @param {String} [format=''] - 格式化
 * @return {String} 过滤后的数据
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
export function filterNull(str, format = '') {
  if (isNull(str)) {
    return format;
  }
  return str;
}
