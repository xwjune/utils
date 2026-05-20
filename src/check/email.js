/**
 * 邮箱校验
 * 规则：登录名@主机名.域名
 *
 * ^[a-zA-Z0-9._-]+：表示邮箱名的开始，可以包含字母、数字、点（.）、下划线（_）或破折号（-），并且至少有一个字符。
 * @：邮箱地址必须包含一个@符号。
 * [a-zA-Z0-9.-]+：表示域名部分，可以包含字母、数字、点（.）或破折号（-），并且至少有一个字符。
 * \.[a-zA-Z]{2,6}$：表示顶级域名（TLD），以点（.）开始，后面跟着2到6个字母。
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
export default function email(value) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
}
