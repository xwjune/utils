"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.filterNull = filterNull;

var _isNull = _interopRequireDefault(require("../check/isNull"));

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
function filterNull(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if ((0, _isNull.default)(str)) {
    return format;
  }

  return str;
}