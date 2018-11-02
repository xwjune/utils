'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-bitwise */

// 索引表
var keyStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_=';

// UTF-8 encoding
function utf8Encode(value) {
  var utftext = '';
  var string = value.replace(/\r\n/g, '\n');

  for (var n = 0, len = string.length; n < len; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode(c >> 6 | 192);
      utftext += String.fromCharCode(c & 63 | 128);
    } else {
      utftext += String.fromCharCode(c >> 12 | 224);
      utftext += String.fromCharCode(c >> 6 & 63 | 128);
      utftext += String.fromCharCode(c & 63 | 128);
    }
  }
  return utftext;
}

// UTF-8 decoding
function utf8Decode(utftext) {
  var string = '';
  var i = 0;
  var c = 0;
  var c2 = 0;
  var c3 = 0;

  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode((c & 31) << 6 | c2 & 63);
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      i += 3;
    }
  }
  return string;
}

/**
 * base64加密/解密【用于暴露在url中的重要参数】
 * 索引表已做特殊处理
 *
 * encode - 加密
 * decode - 解密
 */

var Ctypt = function Ctypt() {
  (0, _classCallCheck3.default)(this, Ctypt);

  this.encode = function (value) {
    var output = '';
    var chr1 = void 0;
    var chr2 = void 0;
    var chr3 = void 0;
    var enc1 = void 0;
    var enc2 = void 0;
    var enc3 = void 0;
    var enc4 = void 0;
    var i = 0;
    var input = utf8Encode(value);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;
      if ((0, _isNan2.default)(chr2)) {
        enc3 = 64;
        enc4 = 64;
      } else if ((0, _isNan2.default)(chr3)) {
        enc4 = 64;
      }
      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  };

  this.decode = function (value) {
    var output = '';
    var chr1 = void 0;
    var chr2 = void 0;
    var chr3 = void 0;
    var enc1 = void 0;
    var enc2 = void 0;
    var enc3 = void 0;
    var enc4 = void 0;
    var i = 0;
    var input = value.replace(/[^A-Za-z0-9-_=]/g, '');

    while (i < input.length) {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output += String.fromCharCode(chr1);
      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }
    output = utf8Decode(output);
    return output;
  };
}
/**
 * 加密
 *
 * @param {String} value - 需要加密的数据
 * @return {String} 已加密的数据
 * @example
 *
 * encode('123456');
 * // => CJ8pD3Ks
 */


/**
 * 解密
 *
 * @param {String} value - 需要解密的数据
 * @return {String} 已解密的数据
 * @example
 *
 * decode('CJ8pD3Ks');
 * // => 123456
 */
;

exports.default = new Ctypt();