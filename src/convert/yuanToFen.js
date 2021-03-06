/**
 * 元->分
 * 为防止浮点数运算精度丢失，故采用字符串形式解析
 *
 * @param {Number} value - 元
 * @param {String} [format='0'] - 空数据格式化
 * @returns {String} 分
 * @example
 *
 * yuanToFen(20);
 * // => 2000
 *
 * yuanToFen(0.02);
 * // => 2
 *
 * yuanToFen(0.002); // 非正确格式
 * // => 0
 *
 * yuanToFen();
 * // => 0
 *
 * yuanToFen(undefined, '--'); // 空数据格式化
 * // => --
 *
 * yuanToFen('num'); // 错误数据
 * // => ''
 */
export default function yuanToFen(value, format = '0') {
  if (
    value === undefined
    || value === null
    || value === ''
  ) {
    return format;
  }
  if (!/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value)) {
    return '';
  }

  const str = value.toString();
  let result = '';
  if (str.indexOf('.') > -1) {
    const strArr = str.split('.');
    const len = strArr[1].length;
    switch (len) {
      case 1:
        // 特殊数据：0.0 => 000、 0.1 => 010
        result = `${strArr[0]}${strArr[1]}0`;
        break;
      case 2:
        // 特殊数据：0.00 => 000、 0.01 => 001、 0.10 => 010
        result = str.replace('.', '');
        break;
      default:
        // 只保留两位小数
        // 特殊数据：0.000 => 000、 0.001 => 000、 0.010 => 001、 0.101 => 010
        result = `${strArr[0]}${strArr[1].substr(0, 2)}`;
    }
  } else {
    result = `${str}00`;
  }
  // 特殊数据处理：000 => 0、 001 => 1、 010 => 10
  result = result.replace(/^(-?)(0{1,2})/, '$1'); // Trim zeros at the beginning.

  return result;
}
