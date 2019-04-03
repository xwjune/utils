"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = fenToYuan;

var _number = require("../check/number");

/**
 * 分->元
 * 为防止浮点数运算精度丢失，故采用字符串形式解析
 *
 * @param {Number} money - 分
 * @param {String} [format='0.00'] - 格式化
 * @param {Boolean} [cutZero=false] - 是否去掉小数末尾多余的零
 * @returns {String} 元
 * @example
 *
 * fenToYuan(2000);
 * // => 20.00
 *
 * fenToYuan(2000, '0', true);
 * // => 20
 *
 * fenToYuan(2000.45); // 非正确格式，舍去小数部分
 * // => 20.00
 *
 * fenToYuan();
 * // => 0.00
 *
 * fenToYuan(null, '--');
 * // => --
 */
function fenToYuan(money) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0.00';
  var cutZero = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!(0, _number.isNumber)(money, false)) {
    return format;
  }

  var str = money.toString();
  var result = '';

  if (str[0] === '-') {
    result += '-';
    str = str.substr(1);
  }

  if (str.indexOf('.') > -1) {
    // Trim decimal at the ending.
    str = str.replace(/\.[0-9]+$/, '');
  }

  var len = str.length;

  switch (len) {
    case 1:
      result += "0.0".concat(str);
      break;

    case 2:
      result += "0.".concat(str);
      break;

    default:
      result += "".concat(str.substr(0, len - 2), ".").concat(str.substr(len - 2));
  }

  if (cutZero) {
    // Cut zero at the ending.
    result = result.match(/-?[0-9]+(\.[0-9]*[1-9])?/)[0];
  }

  return result;
}