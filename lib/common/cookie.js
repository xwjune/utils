"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.getCookie = getCookie;
exports.setCookie = setCookie;
exports.delCookie = delCookie;

/**
 * cookie操作
 *
 * getCookie - 读取cookie
 * setCookie - 创建cookie
 * delCookie - 删除cookie
 */

/**
 * 读取cookie
 *
 * @param {String} name
 * @returns {String}
 */
function getCookie(name) {
  var reg = new RegExp("(^|\\s)".concat(name, "=([^;]*)(;|$)"));
  var result;

  try {
    result = document.cookie.match(reg)[2];
    result = decodeURIComponent(result);
  } catch (e) {
    result = null;
  }

  return result;
}
/**
 * 创建cookie
 *
 * @param {String} name - cookie名称
 * @param {String} value - cookie字符串值
 * @param {Object} [options={}] - 配置
 * @param {String} [options.domain] - 域名
 * @param {String} [options.path] - 路径
 * @param {Number} [options.maxAge] - 过期时间【单位是秒】
 * @param {Date} [options.expires] - 失效时间
 * @param {Boolean} [options.httpOnly] - 程序是否可读取到cookie信息【防止XSS攻击】
 * @param {Boolean} [options.secure] - 安全标志
 * @param {String} [options.sameSite] - 跨域安全机制
 * @example
 *
 * // 一天后过期
 * setCookie('name', 'value', {
 *   maxAge: 60 * 60 * 24,
 * });
 */


function setCookie(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!name) return;
  var str = "".concat(name, "=").concat(encodeURIComponent(value));

  if (options.maxAge) {
    var exp = new Date();
    exp.setTime(exp.getTime() + options.maxAge * 1000);
    options.expires = exp;
  }

  if (options.domain) {
    str += "; Domain=".concat(options.domain);
  }

  if (options.path) {
    str += "; Path=".concat(options.path);
  }

  if (options.expires) {
    str += "; Expires=".concat(options.expires.toUTCString());
  }

  if (options.httpOnly) {
    str += '; HttpOnly';
  }

  if (options.secure) {
    str += '; Secure';
  }

  if (options.sameSite) {
    if (options.sameSite.search(/^strict$/i) !== -1) {
      str += '; SameSite=Strict';
    } else if (options.sameSite.search(/^lax$/i) !== -1) {
      str += '; SameSite=Lax';
    }
  }

  document.cookie = str;
}
/**
 * 删除cookie
 *
 * @param {String} name
 */


function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var value = getCookie(name);

  if (value !== null) {
    document.cookie = "".concat(name, "=").concat(value, "; Expires=").concat(exp.toUTCString());
  }
}