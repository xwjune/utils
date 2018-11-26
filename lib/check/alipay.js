'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alipay;

var _email = require('./email');

var _email2 = _interopRequireDefault(_email);

var _phone = require('./phone');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 支付宝账号校验
 * 规则：邮箱或手机号
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * alipay('test@163.com');
 * // => true
 *
 * alipay('13456789012');
 * // => true
 */
function alipay(value) {
  return (0, _email2.default)(value) || (0, _phone.cellphone)(value);
}