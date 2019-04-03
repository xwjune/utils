"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

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

  (0, _classCallCheck2.default)(this, App);
  (0, _defineProperty2.default)(this, "isIos", function () {
    return /CPU.+Mac OS X/i.test(navigator.userAgent);
  });
  (0, _defineProperty2.default)(this, "isAndroid", function () {
    return /Android|Adr/i.test(navigator.userAgent);
  });
  (0, _defineProperty2.default)(this, "isMobile", function () {
    return /iPhone|iPad|iPod|Android|Mobile|SymbianOS|Windows Phone|BlackBerry|webOS/i.test(navigator.userAgent);
  });
  (0, _defineProperty2.default)(this, "isWeChat", function () {
    return /MicroMessenger/i.test(navigator.userAgent);
  });
  (0, _defineProperty2.default)(this, "isAliPay", function () {
    return /AlipayClient/i.test(navigator.userAgent);
  });
  (0, _defineProperty2.default)(this, "isTaobao", function () {
    return /AliApp\(TB/i.test(navigator.userAgent);
  });
  (0, _defineProperty2.default)(this, "alipayJSBridgeReady", function (callback) {
    if (window.AlipayJSBridge) {
      // 如果jsbridge已经注入则直接调用
      if (callback) {
        callback();
      }
    } else {
      // 如果没有注入则监听注入的事件
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  });
  (0, _defineProperty2.default)(this, "alipayTitle", function (title, subtitle) {
    _this.alipayJSBridgeReady(function () {
      window.AlipayJSBridge.call('setTitle', {
        title: title,
        subtitle: subtitle
      });
    });
  });
  (0, _defineProperty2.default)(this, "alipayPopWindow", function () {
    _this.alipayJSBridgeReady(function () {
      window.AlipayJSBridge.call('popWindow');
    });
  });
  (0, _defineProperty2.default)(this, "alipayExitApp", function () {
    _this.alipayJSBridgeReady(function () {
      window.AlipayJSBridge.call('exitApp');
    });
  });
};

var _default = new App();

exports.default = _default;