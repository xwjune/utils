'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 校验库
 *
 * cellphone - 手机
 * telPhone - 电话
 * email - 邮箱
 * postcode - 邮编
 * isNull - 空判断
 * hasChinese - 中文
 * hasFullChar - 全角符号
 * noChinese - 非中文
 * url
 * ip
 * idCard - 身份证
 * Card - 银行卡号
 */
var Check = function () {
  function Check() {
    (0, _classCallCheck3.default)(this, Check);

    this.isNull = function (str) {
      if (typeof str === 'undefined' || str === 'undefined' || str === null || str === 'null' || str === '(null)' || str === 'NaN' || str === '') {
        return true;
      }
      return false;
    };
  }

  (0, _createClass3.default)(Check, [{
    key: 'cellphone',

    /**
     * 手机
     * 格式：11位数字，首位1
     *
     * @param {String} value - 手机
     * @return {Boolean} true-是，false-否
     * @example
     *
     * cellphone('13456789012');
     * // => true
     */
    value: function cellphone(value) {
      return (/^1\d{10}$/.test(value)
      );
    }

    /**
     * 电话
     * 格式：3-4位区号，7-8位直拨号码
     *
     * @param {String} value - 电话
     * @return {Boolean} true-是，false-否
     */

  }, {
    key: 'telphone',
    value: function telphone(value) {
      return (/^(\d{3,4}-?)?\d{7,8}$/.test(value)
      );
    }

    /**
     * 邮箱
     * 格式：登录名@主机名.域名
     *
     * @param {String} value - 邮箱
     * @return {Boolean} true-是，false-否
     *
     * email('june@163.com');
     * // => true
     */

  }, {
    key: 'email',
    value: function email(value) {
      return (/^.+@.+\..+/.test(value)
      );
    }

    /**
     * 邮编
     * 格式：6位数字
     */

  }, {
    key: 'postcode',
    value: function postcode(v) {
      return (/^\d{6}$/.test(v)
      );
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
     *
     * isNull('xxx');
     * // => false
     */

  }, {
    key: 'hasChinese',


    /**
     * 判断中【日、韩】文字符（不包括标点符号）
     * u4e00-u9fbf: unicode CJK(中日韩)统一表意字符，u9fa5后至u9fbf为空
     * uF900-uFAFF: unicode CJK兼容象形文字，uFA2D后至uFAFF为空
     *
     */
    value: function hasChinese(v) {
      return (/[\u4e00-\u9fa5\uF900-\uFA2D]/.test(v)
      );
    }

    /**
     * 是否含有全角符号
     *
     */

  }, {
    key: 'hasFullChar',
    value: function hasFullChar(v) {
      return (/[\uFF00-\uFFEF]/.test(v)
      );
    }

    /**
     * 非中文
     *
     */
    // noChinese(v) {
    //   return /[^\u0000-\u00FF]/.test(v);
    // }

    /**
     * url
     *
     */

  }, {
    key: 'url',
    value: function url() {}

    /**
     * ip
     */

  }, {
    key: 'ip',
    value: function ip() {}

    /**
     * 身份证
     * @param {boolean} strict 是否严格校验
     *
     * 非严格校验：18位，最后一位为数字或X
     *
     * 严格校验：
     * 地区码：
     *  11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
     *  21:"辽宁",22:"吉林",23:"黑龙江",
     *  31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
     *  41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",
     *  50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
     *  61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
     *  71:"台湾",81:"香港",82:"澳门"
     * 加权因子：[ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
     *
     */
    // idCard(strict) {
    //   if (strict) {
    //     // 地区码
    //     const district = /(1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|(71|81|82)[1-9]{4}/;
    //   } else {
    //     // 非严格校验
    //     return /^\d{17}(\d|X)$/i.test(v);
    //   }
    // }

  }]);
  return Check;
}();

exports.default = new Check();