'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

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
 * hasChinese - 中文判断
 * pwdIntensity - 弱密码校验
 * idCard - 身份证校验
 */
var Check =

// 日期是否正确判断
// 支付宝账号
// 银行卡号
function Check() {
  var _this = this;

  (0, _classCallCheck3.default)(this, Check);

  this.cellphone = function (value) {
    return (/^1\d{10}$/.test(value)
    );
  };

  this.telphone = function (value) {
    return (/^(\d{3,4}-?)?\d{7,8}$/.test(value)
    );
  };

  this.phone = function (value) {
    return _this.cellphone(value) || _this.telphone(value);
  };

  this.email = function (value) {
    return (/^[0-9a-zA-Z_.-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+$/.test(value)
    );
  };

  this.postcode = function (value) {
    return (/^\d{6}$/.test(value)
    );
  };

  this.isNull = function (value) {
    if (typeof value === 'undefined' || value === 'undefined' || value === null || value === 'null' || value === '(null)' || value === 'NaN' || value === '') {
      return true;
    }
    return false;
  };

  this.isNumber = function (value) {
    return (/^-?\d+(\.\d+)?$/.test(value)
    );
  };

  this.isInteger = function (value) {
    return (/^-?\d+$/.test(value)
    );
  };

  this.isDecimal = function (value) {
    return (/^-?\d+\.\d+$/.test(value)
    );
  };

  this.hasChinese = function (value) {
    var pattern = ['\u2E80-\u2EFF', // CJK 部首补充
    '\u2F00-\u2FDF', // 康熙字典部首
    '\u2FF0-\u2FFF', // 表意文字描述符
    '\u3000-\u303F', // CJK 符号和标点
    '\u31C0-\u31EF', // CJK 笔画
    '\u3300-\u33FF', // CJK 兼容
    '\u3400-\u4DBF', // CJK 统一表意符号扩展 A
    '\u4E00-\u9FBF', // CJK 统一表意符号
    '\uF900-\uFAFF', // CJK 兼容象形文字
    '\uFE30-\uFE4F'];
    var regexp = new RegExp('[' + pattern.join('') + ']');
    return regexp.test(value);
  };

  this.pwdIntensity = _pwdIntensity2.default;

  this.idCard = function (value) {
    return (/^\d{15}$|(^\d{17}(\d|X)$)/i.test(value)
    );
  };
}
/**
 * 手机校验
 * 格式：11位数字，首位1
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 * @example
 *
 * cellphone('13456789012');
 * // => true
 */


/**
 * 固定电话校验
 * 格式：3-4位区号，7-8位直拨号码
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 * @example
 *
 * telphone('0576-85735299');
 * // => true
 *
 * telphone('057685735299');
 * // => true
 */


/**
 * 电话【手机和固定电话】校验
 *
 * @param {*} vlaue - The value to check
 * @return {Boolean} true-是，false-否
 * @example
 *
 * phone('0576-85735299');
 * // => true
 *
 * phone('13456789012');
 * // => true
 */


/**
 * 邮箱校验
 * 格式：登录名@主机名.域名
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 *
 * email('june@163.com');
 * // => true
 *
 * email('te_st@sima.vip.com');
 * // => true
 */


/**
 * 邮编校验
 * 格式：6位数字
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 *
 * postcode('310000');
 * // => true
 *
 * pwdIntensity('123456abc');
 * // => 2
 */


/**
 * 空校验
 * 空数据集合：undefined,'undefined',null,'null','(null)','NaN',''
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 * @example
 *
 * isNull();
 * // => true
 *
 * isNull('undefined');
 * // => true
 */


/**
 * 数字校验
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-数字，false-非数字
 * @example
 *
 * isNumber('20');
 * // => true
 *
 * isNumber('.2');
 * // => false
 */


/**
 * 整数校验
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-数字，false-非数字
 * @example
 *
 * isInteger('20');
 * // => true
 *
 * isInteger('0.2');
 * // => false
 */


/**
 * 小数校验
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-数字，false-非数字
 * @example
 *
 * isDecimal('0.2');
 * // => true
 *
 * isDecimal('20');
 * // => false
 */


/**
 * 中文判断
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 * @example
 *
 * hasChinese('中文');
 * // => true
 *
 * hasChinese('。');
 * // => true
 */


/**
 * 弱密码校验
 *
 *（1）位数为6-32位，包括6位或32位
 *（2）包含以下任意两种或以上组成元素：
 *    ① 数字
 *    ② 大写字母
 *    ③ 小写字母
 *    ④ 符号【键盘上可以打出来的符号】
 *
 * @param {String} pwd - 密码
 * @return {Number} intensity - 密码强度 1-弱|2-中|3-强
 * @example
 *
 * pwdIntensity('123456');
 * // => 1
 *
 * pwdIntensity('123456abc');
 * // => 2
 */


/**
 * 身份证校验
 * 15位【一代身份证】或18位【二代身份证】
 *
 * @param {*} value - The value to check
 * @return {Boolean} true-是，false-否
 * @example
 *
 * idCard('330000199001017865');
 * // => true
 *
 * idCard('33000019900101786X');
 * // => true
 */
;

exports.default = new Check();