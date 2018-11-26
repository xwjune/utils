"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cellphone = cellphone;
exports.telphone = telphone;
exports.phone = phone;
/**
 * 手机校验
 * 规则：11位数字，首位1
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * cellphone('13456789012');
 * // => true
 */
function cellphone(value) {
  return (/^1\d{10}$/.test(value)
  );
}

/**
 * 固定电话校验
 * 规则：3-4位区号，7-8位直拨号码
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * telphone('0571-85735888');
 * // => true
 *
 * telphone('057185735888');
 * // => true
 *
 * telphone('85735888');
 * // => true
 */
function telphone(value) {
  return (/^(\d{3,4}-?)?\d{7,8}$/.test(value)
  );
}

/**
 * 电话【手机和固定电话】校验
 *
 * @param {*} vlaue - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * phone('057185735888');
 * // => true
 *
 * phone('13456789012');
 * // => true
 */
function phone(value) {
  return cellphone(value) || telphone(value);
}