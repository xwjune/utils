'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterNull = filterNull;

var _isNull = require('../check/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filterNull(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if ((0, _isNull2.default)(str)) {
    return format;
  }
  return str;
} /**
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