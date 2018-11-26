"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = email;
/**
 * 邮箱校验
 * 规则：登录名@主机名.域名
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 *
 * email('test@163.com');
 * // => true
 *
 * email('te_st@sima.vip.com');
 * // => true
 */
function email(value) {
  return (/^[0-9a-zA-Z_.-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+$/.test(value)
  );
}