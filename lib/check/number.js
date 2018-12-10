'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

exports.isNumber = isNumber;
exports.isInteger = isInteger;
exports.isDecimal = isDecimal;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 数字校验
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isNumber('20');
 * // => true
 *
 * isNumber('-20');
 * // => true
 */
function isNumber(value) {
  if (typeof value === 'number') {
    return true;
  }
  if (typeof value === 'string' && value !== '' && !/^\./.test(value) // 排除数据 .x【.2、.3】
  && !/\.$/.test(value) // 排除数据 x.【2.、3.】
  && !/^0[^.]/.test(value) // 排除数据02、002等
  && !(0, _isNan2.default)(Number(value))) {
    return true;
  }
  return false;
}

/**
 * 整数校验
 * 不兼容科学计数法的数字
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isInteger('20');
 * // => true
 *
 * isInteger('-20');
 * // => true
 *
 * isInteger('0.2');
 * // => false
 *
 * isInteger('020');
 * // => false
 */
function isInteger(value) {
  return (/^-?(0|[1-9][0-9]*)$/.test(value)
  );
}

/**
 * 小数校验
 * 不兼容科学计数法的数字
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * isDecimal('0.2');
 * // => true
 *
 * isDecimal('-0.2');
 * // => true
 *
 * isDecimal('20');
 * // => false
 *
 * isDecimal('00.2');
 * // => false
 */
function isDecimal(value) {
  return (/^-?(0|[1-9][0-9]*)\.\d+$/.test(value)
  );
}