'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _phone = require('./phone');

var _email = require('./email');

var _email2 = _interopRequireDefault(_email);

var _postcode = require('./postcode');

var _postcode2 = _interopRequireDefault(_postcode);

var _isNull = require('./isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _number = require('./number');

var _money = require('./money');

var _money2 = _interopRequireDefault(_money);

var _hasChinese = require('./hasChinese');

var _hasChinese2 = _interopRequireDefault(_hasChinese);

var _idCard = require('./idCard');

var _idCard2 = _interopRequireDefault(_idCard);

var _ip = require('./ip');

var _ip2 = _interopRequireDefault(_ip);

var _alipay = require('./alipay');

var _alipay2 = _interopRequireDefault(_alipay);

var _pwdIntensity = require('./pwdIntensity');

var _pwdIntensity2 = _interopRequireDefault(_pwdIntensity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.default = {
  cellphone: _phone.cellphone,
  telphone: _phone.telphone,
  phone: _phone.phone,
  email: _email2.default,
  postcode: _postcode2.default,
  isNull: _isNull2.default,
  isNumber: _number.isNumber,
  isInteger: _number.isInteger,
  isDecimal: _number.isDecimal,
  money: _money2.default,
  hasChinese: _hasChinese2.default,
  idCard: _idCard2.default,
  ip: _ip2.default,
  alipay: _alipay2.default,
  pwdIntensity: _pwdIntensity2.default
};

// todo
// 日期是否正确判断