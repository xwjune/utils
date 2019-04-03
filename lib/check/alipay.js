"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = alipay;

var _email = _interopRequireDefault(require("./email"));

var _phone = require("./phone");

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
  return (0, _email.default)(value) || (0, _phone.cellphone)(value);
}