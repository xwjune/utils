'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * app交互
 *
 * isIos - IOS环境判断
 * isAndroid - Android环境判断
 * isMobile - 移动端【手机、平板设备】环境判断
 * isWeChat - 微信客户端判断
 * isAliPay - 支付宝客户端判断
 * isTaobao - 淘宝客户端判断
 * alipayJSBridgeReady - 监听alipay容器初始化
 * alipayTitle - 支付宝设置标题
 * alipayPopWindow - 支付宝关闭当前页面
 * alipayExitApp - 支付宝退出当前应用
 */
var App = function App() {
  var _this = this;

  (0, _classCallCheck3.default)(this, App);

  this.isIos = function () {
    return (/CPU.+Mac OS X/i.test(navigator.userAgent)
    );
  };

  this.isAndroid = function () {
    return (/Android|Adr/i.test(navigator.userAgent)
    );
  };

  this.isMobile = function () {
    return (/iPhone|iPad|iPod|Android|Mobile|SymbianOS|Windows Phone|BlackBerry|webOS/i.test(navigator.userAgent)
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

  this.alipayJSBridgeReady = function (callback) {
    if (window.AlipayJSBridge) {
      // 如果jsbridge已经注入则直接调用
      if (callback) {
        callback();
      }
    } else {
      // 如果没有注入则监听注入的事件
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  };

  this.alipayTitle = function (title, subtitle) {
    _this.alipayJSBridgeReady(function () {
      window.AlipayJSBridge.call('setTitle', {
        title: title,
        subtitle: subtitle
      });
    });
  };

  this.alipayPopWindow = function () {
    _this.alipayJSBridgeReady(function () {
      window.AlipayJSBridge.call('popWindow');
    });
  };

  this.alipayExitApp = function () {
    _this.alipayJSBridgeReady(function () {
      window.AlipayJSBridge.call('exitApp');
    });
  };
}
/**
 * IOS环境判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * Android环境判断
 *
 * @return {Boolean} true-是，false-否
 */


/**
 * 移动端【手机、平板设备】环境判断
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
 * 监听alipay容器初始化
 *
 * @param {Function} [callback] - 回调
 */


/**
 * 支付宝设置标题
 *
 * @param {String} title - 标题
 * @param {String} [subtitle] - 副标题
 */


/**
 * 支付宝关闭当前页面
 */


/**
 * 支付宝退出当前应用
 */
;

exports.default = new App();