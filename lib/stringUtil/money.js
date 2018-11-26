'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertFenToYuan = convertFenToYuan;
exports.convertYuanToFen = convertYuanToFen;
/**
 * 分->元
 * 为防止浮点数及大数运算精度丢失，故采用字符串形式解析
 *
 * @param {String} str - 分
 * @param {String} [format='0.00'] - 格式化
 * @return {String} 元
 * @example
 *
 * convertFenToYuan('2000');
 * // => 20.00
 *
 * convertFenToYuan('2000.45'); // 非正确格式，舍去小数部分
 * // => 20.00
 *
 * convertFenToYuan();
 * // => 0.00
 *
 * convertFenToYuan(null, '--');
 * // => --
 */
function convertFenToYuan(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0.00';

  if (!/^-?(\d|[1-9]\d+)(\.\d+)?$/.test(str)) {
    return format;
  }
  str = str.toString();
  var result = '';
  if (str[0] === '-') {
    result = '-';
    str = str.substr(1);
  }
  if (str.indexOf('.') > -1) {
    str = str.replace(/\.\d+$/, ''); // Trim decimal at the ending.
  }
  var len = str.length;
  switch (len) {
    case 1:
      result += '0.0' + str;
      break;
    case 2:
      result += '0.' + str;
      break;
    default:
      result += str.substr(0, len - 2) + '.' + str.substr(len - 2);
  }

  return result;
}

/**
 * 元->分
 * 为防止浮点数及大数运算精度丢失，故采用字符串形式解析
 *
 * @param {String} str - 元
 * @param {String} [format='0'] - 格式化
 * @return {String} 分
 * @example
 *
 * convertYuanToFen('20');
 * // => 2000
 *
 * convertYuanToFen('0.02');
 * // => 2
 *
 * convertYuanToFen('0.002');
 * // => 0
 *
 * convertYuanToFen();
 * // => 0
 *
 * convertYuanToFen(null, '--');
 * // => --
 */
function convertYuanToFen(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

  if (!/^-?(\d|[1-9]\d+)(\.\d+)?$/.test(str)) {
    return format;
  }
  str = str.toString();
  var result = '0';
  if (str.indexOf('.') > -1) {
    var strArr = str.split('.');
    var len = strArr[1].length;
    switch (len) {
      case 1:
        // 特殊数据：0.0 => 000、 0.1 => 010
        result = '' + strArr[0] + strArr[1] + '0';
        break;
      case 2:
        // 特殊数据：0.00 => 000、 0.01 => 001、 0.10 => 010
        result = str.replace('.', '');
        break;
      default:
        // 只保留两位小数
        // 特殊数据：0.000 => 000、 0.001 => 000、 0.010 => 001、 0.101 => 010
        result = '' + strArr[0] + strArr[1].substr(0, 2);
    }
  } else {
    result = str + '00';
  }
  // 特殊数据处理：000 => 0、 001 => 1、 010 => 10
  result = result.replace(/^(-?)(0{1,2})/, '$1'); // Trim zeros at the beginning.

  return result;
}