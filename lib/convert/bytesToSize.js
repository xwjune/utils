"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = bytesToSize;

var _number = require("../check/number");

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
 * bytesToSize(1024*1024, 2);
 * // => 1.00MB
 *
 * bytesToSize('xx');
 * // => 0B
 */
function bytesToSize(bytes) {
  var digit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0B';

  if (!(0, _number.isNumber)(bytes)) {
    return format;
  }

  if (Number(bytes) === 0 || bytes < 0) {
    return '0B';
  }

  if (bytes < 1) {
    return "".concat(bytes, "B");
  }

  var k = 1024;
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB'];
  var uLen = units.length;
  var i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i < uLen) {
    return "".concat((bytes / Math.pow(k, i)).toFixed(digit)).concat(units[i]);
  }

  return "".concat((bytes / Math.pow(k, uLen - 1)).toFixed(digit)).concat(units[uLen - 1]);
}