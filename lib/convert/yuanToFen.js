"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = yuanToFen;

var _number = require("../check/number");

/**
 * 元->分
 * 为防止浮点数运算精度丢失，故采用字符串形式解析
 *
 * @param {Number} money - 元
 * @param {String} [format='0'] - 格式化
 * @returns {String} 分
 * @example
 *
 * yuanToFen(20);
 * // => 2000
 *
 * yuanToFen(0.02);
 * // => 2
 *
 * yuanToFen(0.002);
 * // => 0
 *
 * yuanToFen();
 * // => 0
 *
 * yuanToFen(null, '--');
 * // => --
 */
function yuanToFen(money) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

  if (!(0, _number.isNumber)(money, false)) {
    return format;
  }

  var str = money.toString();
  var result = '';

  if (str.indexOf('.') > -1) {
    var strArr = str.split('.');
    var len = strArr[1].length;

    switch (len) {
      case 1:
        // 特殊数据：0.0 => 000、 0.1 => 010
        result = "".concat(strArr[0]).concat(strArr[1], "0");
        break;

      case 2:
        // 特殊数据：0.00 => 000、 0.01 => 001、 0.10 => 010
        result = str.replace('.', '');
        break;

      default:
        // 只保留两位小数
        // 特殊数据：0.000 => 000、 0.001 => 000、 0.010 => 001、 0.101 => 010
        result = "".concat(strArr[0]).concat(strArr[1].substr(0, 2));
    }
  } else {
    result = "".concat(str, "00");
  } // 特殊数据处理：000 => 0、 001 => 1、 010 => 10


  result = result.replace(/^(-?)(0{1,2})/, '$1'); // Trim zeros at the beginning.

  return result;
}