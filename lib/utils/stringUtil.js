'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 字符串操作
 *
 * isNull - 空校验
 * isNumber - 数字校验
 * filterNull - 空数据过滤
 * convertFenToYuan - 分转化成元
 * convertYuanToFen - 元转化为分
 */
var StringUtil =

// todo
// 数字金额转化为中文金额
function StringUtil() {
  var _this = this;

  (0, _classCallCheck3.default)(this, StringUtil);

  this.isNull = function (str) {
    if (typeof str === 'undefined' || str === 'undefined' || str === null || str === 'null' || str === '(null)' || str === 'NaN' || str === '') {
      return true;
    }
    return false;
  };

  this.isNumber = function (str) {
    return (/^-?\d+(\.\d+)?$/.test(str)
    );
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

    if (!_this.isNumber(str)) {
      return format;
    }
    str = str.toString();
    if (str.indexOf('.') > -1) {
      // 非正确格式，舍去小数部分
      str = str.replace(/\.\d+$/, '');
    }
    var len = str.length;
    switch (len) {
      case 1:
        return '0.0' + str;
      case 2:
        return '0.' + str;
      default:
        return str.substr(0, len - 2) + '.' + str.substr(len - 2);
    }
  };

  this.convertYuanToFen = function (str) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

    if (!_this.isNumber(str)) {
      return format;
    }
    var result = '0';
    str = str.toString();
    if (str.indexOf('.') > -1) {
      var strArr = str.split('.');
      var len = strArr[1].length;
      switch (len) {
        case 1:
          // 特殊情况：0.1 => 010
          result = '' + strArr[0] + strArr[1] + '0';
          break;
        case 2:
          // 特殊情况：
          // 0.01 => 001
          // 0.10 => 010
          result = str.replace('.', '');
          break;
        default:
          // 只保留两位小数
          result = '' + strArr[0] + strArr[1].substr(0, 2);
      }
      // 特殊数据案例：['-0', '0', '0.0', '0.1', '0.00', '0.01', '0.10', '0.008']
      // 特殊处理：000 => 0；001 => 1；010 => 10
      result = result.replace(/^(-?)(00?)/, '$1');
    } else {
      result = /-?0/.test(str) ? str : str + '00';
    }
    return result;
  };
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
 * 数字校验
 *
 * @param {String} str - 字符串
 * @return {Boolean} true-数字，false-非数字
 * @example
 *
 * isNumber('20');
 * // => true
 *
 * isNumber('-20');
 * // => true
 *
 * isNumber('.2');
 * // => false
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
;

exports.default = new StringUtil();