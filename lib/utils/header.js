'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header() {
  var _this = this;

  (0, _classCallCheck3.default)(this, Header);

  this.setPassword = function () {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _this.password = v;
  };

  this.setCommon = function (key) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    (0, _assign2.default)(_this.common, (0, _defineProperty3.default)({}, key, value));
  };

  this.setCommons = function (params) {
    // 没有值的属性默认设为空字符串，以防签名出现key=undefined，导致签名出错
    (0, _keys2.default)(params).forEach(function (key) {
      (0, _assign2.default)(_this.common, (0, _defineProperty3.default)({}, key, params[key] || ''));
    });
  };

  this.getCommon = function (key) {
    return _this.common[key];
  };

  this.signature = function () {
    var common = _this.common;

    var timestamp = (new Date().getTime() / 1000).toFixed();
    var sign = [common.appId + '=appId', common.userId + '=userId', common.deviceId + '=deviceId', common.OSVersion + '=OSVersion', _this.password + '=password', timestamp + '=timestamp'];
    sign.sort();
    sign = sign.join('&');
    sign = (0, _md2.default)(sign);
    (0, _assign2.default)(common, {
      timestamp: timestamp,
      signature: sign
    });
  };

  this.common = {
    appId: '', // app唯一标识
    deviceId: '', // 设备唯一标识
    userId: '', // 用户唯一标识
    OSVersion: '', // 设备系统版本号
    timestamp: '', // 时间戳(秒)
    sign: '', // 签名
    token: '' // 登录后设置
  };
  this.password = ''; // 秘钥
}

// 设置秘钥


// 设置公共请求参数-单个


// 设置公共请求参数-多个


// 获取公共请求参数


// 签名
; /**
   * 请求头
   *
   * @author WeiJun Xiang <xiangweijun@jimistore.com>
   * @date 2017/11/28
   */


exports.default = new Header();