/**
 * 校验库
 *
 * cellphone - 手机校验
 * telphone - 固定电话校验
 * phone - 电话【手机和固定电话】校验
 * email - 邮箱校验
 * postcode - 邮编校验
 * isNull - 空校验
 * isNumber - 数字校验
 * isInteger - 整数校验
 * isDecimal - 小数校验
 * money - 金额【元】判断
 * hasChinese - 中文判断
 * idCard - 身份证校验
 * ip - ip地址校验
 * alipay - 支付宝账号校验
 * pwdIntensity - 弱密码校验
 * illegalChar - 非法字符校验
 */
import {
  cellphone,
  telphone,
  phone,
} from './phone';
import email from './email';
import postcode from './postcode';
import isNull from './isNull';
import {
  isNumber,
  isInteger,
  isDecimal,
} from './number';
import money from './money';
import hasChinese from './hasChinese';
import idCard from './idCard';
import ip from './ip';
import alipay from './alipay';
import pwdIntensity from './pwdIntensity';
import illegalChar from './illegalChar';

export default {
  cellphone,
  telphone,
  phone,
  email,
  postcode,
  isNull,
  isNumber,
  isInteger,
  isDecimal,
  money,
  hasChinese,
  idCard,
  ip,
  alipay,
  pwdIntensity,
  illegalChar,
};

// todo
// 日期是否正确判断
