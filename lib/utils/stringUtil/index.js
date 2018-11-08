'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _convertCurrency = require('./convertCurrency');

var _convertCurrency2 = _interopRequireDefault(_convertCurrency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 字符串操作
 *
 * isNull - 空校验
 * filterNull - 空数据过滤
 * convertFenToYuan - 分转化成元
 * convertYuanToFen - 元转化为分
 * convertCurrency - 数字金额转换为大写人民币汉字
 */
var StringUtil =

// todo
// 汉字转拼音
function StringUtil() {
  var _this = this;

  (0, _classCallCheck3.default)(this, StringUtil);

  this.isNull = function (str) {
    if (typeof str === 'undefined' || str === 'undefined' || str === null || str === 'null' || str === '(null)' || str === 'NaN' || str === '') {
      return true;
    }
    return false;
  };

  this.filterNull = function (str) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (_this.isNull(str)) {
      return format;
    }
    return str;
  };

  this.convertFenToYuan = function (str) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0.00';

    if (!/^-?(\d|[1-9]\d+)(\.\d+)?$/.test(str)) {
      return format;
    }
    str = str.toString();
    var result = '';
    if (str[0] === '-') {
      result = '-';
      str = str.substr(1);
    }
    if (str.indexOf('.') > -1) {
      str = str.replace(/\.\d+$/, ''); // Trim decimal at the ending.
    }
    var len = str.length;
    switch (len) {
      case 1:
        result += '0.0' + str;
        break;
      case 2:
        result += '0.' + str;
        break;
      default:
        result += str.substr(0, len - 2) + '.' + str.substr(len - 2);
    }

    return result;
  };

  this.convertYuanToFen = function (str) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

    if (!/^-?(\d|[1-9]\d+)(\.\d+)?$/.test(str)) {
      return format;
    }
    str = str.toString();
    var result = '0';
    if (str.indexOf('.') > -1) {
      var strArr = str.split('.');
      var len = strArr[1].length;
      switch (len) {
        case 1:
          // 特殊数据：0.0 => 000、 0.1 => 010
          result = '' + strArr[0] + strArr[1] + '0';
          break;
        case 2:
          // 特殊数据：0.00 => 000、 0.01 => 001、 0.10 => 010
          result = str.replace('.', '');
          break;
        default:
          // 只保留两位小数
          // 特殊数据：0.000 => 000、 0.001 => 000、 0.010 => 001、 0.101 => 010
          result = '' + strArr[0] + strArr[1].substr(0, 2);
      }
    } else {
      result = str + '00';
    }
    // 特殊数据处理：000 => 0、 001 => 1、 010 => 10
    result = result.replace(/^(-?)(0{1,2})/, '$1'); // Trim zeros at the beginning.

    return result;
  };

  this.convertCurrency = _convertCurrency2.default;
}
/**
 * 空校验
 * 空数据集合：undefined,'undefined',null,'null','(null)','NaN',''
 *
 * @param {String} str - 字符串
 * @return {Boolean} true-空，false-非空
 * @example
 *
 * isNull();
 * // => true
 *
 * isNull('undefined');
 * // => true
 */


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


/**
 * 分->元
 * 为防止浮点数及大数运算精度丢失，故采用字符串形式解析
 *
 * @param {String} str - 分
 * @param {String} [format='0.00'] - 格式化
 * @return {String} 元
 * @example
 *
 * convertFenToYuan('2000');
 * // => 20.00
 *
 * convertFenToYuan('2000.45'); // 非正确格式，舍去小数部分
 * // => 20.00
 *
 * convertFenToYuan();
 * // => 0.00
 *
 * convertFenToYuan(null, '--');
 * // => --
 */


/**
 * 元->分
 * 为防止浮点数及大数运算精度丢失，故采用字符串形式解析
 *
 * @param {String} str - 元
 * @param {String} [format='0'] - 格式化
 * @return {String} 分
 * @example
 *
 * convertYuanToFen('20');
 * // => 2000
 *
 * convertYuanToFen('0.02');
 * // => 2
 *
 * convertYuanToFen('0.002');
 * // => 0
 *
 * convertYuanToFen();
 * // => 0
 *
 * convertYuanToFen(null, '--');
 * // => --
 */


/**
 * 数字金额转换为大写人民币汉字
 * 最大处理数字：999999999999.99
 *
 * @param {String} str - 数字金额
 * @param {String} [format='零元整'] - 格式化
 * @returns {String} 中文金额
 * @example
 *
 * convertCurrency('0');
 * // => 零元整
 *
 * convertCurrency('');
 * // => 零元整
 *
 * convertCurrency('', '--');
 * // => --
 *
 * convertCurrency('100000000');
 * // => 壹亿元整
 *
 * convertCurrency('100000001');
 * // => 壹亿零壹元整
 *
 * convertCurrency('1.01');
 * // => 壹元零壹分
 *
 * convertCurrency('1.10');
 * // => 壹元壹角
 */
;

exports.default = new StringUtil();