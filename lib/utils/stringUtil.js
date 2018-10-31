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
var StringUtil = function StringUtil() {
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
    return (parseInt(str, 10) / 100).toFixed(2);
  };

  this.convertYuanToFen = function (str) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

    if (!_this.isNumber(str)) {
      return format;
    }
    return parseInt(str * 100, 10).toString();
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
 *
 * @param {String} str - 分
 * @param {String} [format='0.00'] - 格式化
 * @return {String} 元
 * @example
 *
 * convertFenToYuan('2000');
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