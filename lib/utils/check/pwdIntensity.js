'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var pwd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  // 密码长度
  var len = pwd.length;
  // 规则满足条数
  var rule = 0;

  /* ---------- 规则一校验 ----------*/
  // 位数为6-32位，包括6位或32位；
  if (len < 6 || len > 32) return 1;

  /* ---------- 规则二校验 ----------*/
  // 数字
  if (/\d/g.test(pwd)) rule += 1;
  // 大写字母
  if (/[A-Z]/g.test(pwd)) rule += 1;
  // 小写字母
  if (/[a-z]/g.test(pwd)) rule += 1;
  // 包含以下特殊符号
  if (/(`|~|!|@|#|\$|%|\^|&|\*|\(|\)|-|_|\+|=|\{|\}|\[|\]|:|;|'|"|<|>|,|\.|\?|\/|\||\\)/g.test(pwd)) rule += 1;

  switch (rule) {
    case 0:
    case 1:
      // 弱：非有效密码，即没有同时满足有效定义的（1）和（2）
      return 1;
    case 2:
      // 中：有效密码，即满足了有效定义的（1），以及（2）中的任意两种组合
      return 2;
    default:
      // 强：有效密码，即满足了有效定义的（1），以及（2）中的任意三种组合或所有。
      return 3;
  }
};