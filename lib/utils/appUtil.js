"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * app交互
 *
 * isIos - iOS环境判断
 * isAndroid - Android环境判断
 * isWeChat - 微信客户端判断
 * isAliPay - 支付宝客户端判断
 * isTaobao - 淘宝客户端判断
 * isPc - PC环境判断
 */
var App = function App() {
  (0, _classCallCheck3.default)(this, App);

  this.isIos = function () {
    return (/CPU.+Mac OS X/i.test(navigator.userAgent)
    );
  };

  this.isAndroid = function () {
    return (/Android|Adr/i.test(navigator.userAgent)
    );
  };

  this.isWeChat = function () {
    return (/MicroMessenger/i.test(navigator.userAgent)
    );
  };

  this.isAliPay = function () {
    return (/AlipayClient/i.test(navigator.userAgent)
    );
  };

  this.isTaobao = function () {
    return (/AliApp\(TB/i.test(navigator.userAgent)
    );
  };

  this.isPc = function () {
    return !/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/i.test(navigator.userAgent);
  };
}
/**
 * iOS环境判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * Android环境判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * 微信客户端判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * 支付宝客户端判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * 淘宝客户端判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * PC环境判断
 *
 * @return {Boolean} true-是，false-否
 */
;

exports.default = new App();