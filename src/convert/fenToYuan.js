/**
 * 分->元
 * 为防止浮点数运算精度丢失，故采用字符串形式解析
 *
 * @param {Number} value - 分
 * @param {Object} options - 配置参数
 * @param {String} [options.format='0.00'] - 空数据格式化
 * @param {Boolean} [options.cutZero=false] - 是否去掉小数末尾多余的零
 * @param {Boolean} [options.toThousands=false] - 是否使用千位分隔符
 * @returns {String} 元
 * @example
 *
 * fenToYuan(2000);
 * // => 20.00
 *
 * fenToYuan(2000, { cutZero: true }); // 去掉小数末尾多余的零
 * // => 20
 *
 * fenToYuan(2000.45); // 非正确格式，舍去小数部分
 * // => 20.00
 *
 * fenToYuan(1e21); // Number 科学计数法先展开再转换
 * // => 10000000000000000000.00
 *
 * fenToYuan('-0'); // 负零归一化为 0.00
 * // => 0.00
 *
 * fenToYuan();
 * // => 0.00
 *
 * fenToYuan(undefined, { format: '--' }); // 空数据格式化
 * // => --
 *
 * fenToYuan(300000, { toThousands: true }); // 数字千位符分隔
 * // => 3,000
 *
 * fenToYuan('num'); // 错误数据
 * // => ''
 */
import { isDecimalNumber } from '../check/number';
import expandNumber from './expandNumber';

export default function fenToYuan(value, options = {}) {
  const {
    format = '0.00', // 空数据格式化
    cutZero = false, // 是否去掉小数末尾多余的零
    toThousands = false, // 数字千位符分隔
  } = options || {}; // options 显式传 null 时解构会抛 TypeError，兜底为空对象
  if (
    value === undefined
    || value === null
    || value === ''
  ) {
    return format;
  }
  // Number 先展开为十进制字符串，避免科学计数法【如 String(1e-7) === '1e-7'】被误判为数据错误
  let str = typeof value === 'number' ? expandNumber(value) : value.toString();
  if (!isDecimalNumber(str)) {
    return '';
  }

  let result = '';
  if (str[0] === '-') {
    result += '-';
    str = str.substr(1);
  }
  if (str.indexOf('.') > -1) {
    // Trim decimal at the ending.
    str = str.replace(/\.[0-9]+$/, '');
  }

  const len = str.length;
  switch (len) {
    case 1:
      result += `0.0${str}`;
      break;
    case 2:
      result += `0.${str}`;
      break;
    default:
      result += `${str.substr(0, len - 2)}.${str.substr(len - 2)}`;
  }

  // 特殊数据处理：-0.00 => 0.00
  if (result === '-0.00') {
    result = '0.00';
  }

  // Cut zero at the ending.
  if (cutZero) {
    result = result.match(/-?[0-9]+(\.[0-9]*[1-9])?/)[0];
  }

  // 使用千位分隔符
  if (toThousands) {
    const regExp = new RegExp('^(-?[0-9]+)([0-9]{3})');
    while (regExp.test(result)) {
      result = result.replace(regExp, '$1,$2');
    }
  }

  return result;
}
