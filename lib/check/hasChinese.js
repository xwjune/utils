"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = hasChinese;

/**
 * 中文判断
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * hasChinese('中文');
 * // => true
 *
 * hasChinese('。');
 * // => true
 */
function hasChinese(value) {
  var pattern = ["\u2000-\u206F", // 常用标点
  "\u2E80-\u2EFF", // CJK 部首补充
  "\u2F00-\u2FDF", // 康熙字典部首
  "\u2FF0-\u2FFF", // 表意文字描述符
  "\u3000-\u303F", // CJK 符号和标点
  "\u31C0-\u31EF", // CJK 笔画
  "\u3300-\u33FF", // CJK 兼容
  "\u3400-\u4DBF", // CJK 统一表意符号扩展 A
  "\u4E00-\u9FBF", // CJK 统一表意符号
  "\uF900-\uFAFF", // CJK 兼容象形文字
  "\uFE30-\uFE4F", // CJK 兼容形式
  "\uFF00-\uFFEF"];
  var regexp = new RegExp("[".concat(pattern.join(''), "]"));
  return regexp.test(value);
}