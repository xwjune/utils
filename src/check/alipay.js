/**
 * 支付宝账号校验
 *
 * 规则：邮箱或手机号
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * alipay('test@163.com'); // 邮箱账号
 * // => true
 *
 * alipay('13456789012'); // 手机号账号
 * // => true
 */
import email from './email';
import { cellphone } from './phone';

export default function alipay(value) {
  return email(value) || cellphone(value);
}
