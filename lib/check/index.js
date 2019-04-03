"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _phone = require("./phone");

var _email = _interopRequireDefault(require("./email"));

var _postcode = _interopRequireDefault(require("./postcode"));

var _isNull = _interopRequireDefault(require("./isNull"));

var _number = require("./number");

var _money = _interopRequireDefault(require("./money"));

var _hasChinese = _interopRequireDefault(require("./hasChinese"));

var _idCard = _interopRequireDefault(require("./idCard"));

var _ip = _interopRequireDefault(require("./ip"));

var _alipay = _interopRequireDefault(require("./alipay"));

var _pwdIntensity = _interopRequireDefault(require("./pwdIntensity"));

/**
 * 校验库
 *
 * cellphone - 手机校验
 * telphone - 固定电话校验
 * phone - 电话【手机和固定电话】校验
 * email - 邮箱校验
 * postcode - 邮编校验
 * isNull - 空校验
 * isNumber - 数字校验
 * isInteger - 整数校验
 * isDecimal - 小数校验
 * money - 金额【元】判断
 * hasChinese - 中文判断
 * idCard - 身份证校验
 * ip - ip地址校验
 * alipay - 支付宝账号校验
 * pwdIntensity - 弱密码校验
 */
var _default = {
  cellphone: _phone.cellphone,
  telphone: _phone.telphone,
  phone: _phone.phone,
  email: _email.default,
  postcode: _postcode.default,
  isNull: _isNull.default,
  isNumber: _number.isNumber,
  isInteger: _number.isInteger,
  isDecimal: _number.isDecimal,
  money: _money.default,
  hasChinese: _hasChinese.default,
  idCard: _idCard.default,
  ip: _ip.default,
  alipay: _alipay.default,
  pwdIntensity: _pwdIntensity.default
}; // todo
// 日期是否正确判断

exports.default = _default;