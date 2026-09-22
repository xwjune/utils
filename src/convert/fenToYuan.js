/**
 * 分->元
 *
 * @param {number|string} value - 分
 * @param {Object} options - 配置参数
 * @param {string} [options.format] - 空数据格式化，缺省按其余配置渲染零值
 * @param {boolean} [options.trimZeros=false] - 是否去掉小数末尾多余的零
 * @param {boolean} [options.toThousands=false] - 是否使用千位分隔符
 * @returns {string} 元
 * @example
 *
 * fenToYuan(2000);
 * // => 20.00
 *
 * fenToYuan(2000, { trimZeros: true }); // 去掉小数末尾多余的零
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
 * fenToYuan(undefined, { trimZeros: true }); // 缺省占位随 trimZeros 去零
 * // => 0
 *
 * fenToYuan(300000, { toThousands: true }); // 数字千位符分隔
 * // => 3,000
 *
 * fenToYuan('num'); // 错误数据
 * // => ''
 *
 * fenToYuan([2000]); // 隐式转换字符串的类数组不纳入
 * // => ''
 */
import isNull from '../check/isNull';
import { isDecimalNumber } from '../check/number';
import expandNumber from './expandNumber';

// 全程按字符串解析，防止浮点数运算精度丢失【如 11.2 / 100 => 0.11199999999999999】
export default function fenToYuan(value, options = {}) {
  const {
    format, // 空数据格式化
    trimZeros = false, // 是否去掉小数末尾多余的零
    toThousands = false, // 数字千位符分隔
  } = options || {}; // options 显式传 null 时解构会抛 TypeError，兜底为空对象

  if (isNull(value)) {
    // 缺省占位与零值同款渲染，复用自身转换【trimZeros/toThousands 原样透传】
    return format !== undefined ? format : fenToYuan(0, { trimZeros, toThousands });
  }
  // Number 先展开为十进制字符串，避免科学计数法【如 String(1e-7) === '1e-7'】被误判为数据错误
  let str = typeof value === 'number' ? expandNumber(value) : value;
  // 仅接受数字与十进制数字字面量字符串
  if (!isDecimalNumber(str)) {
    return '';
  }

  let result = '';
  if (str[0] === '-') {
    result += '-';
    str = str.slice(1);
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
      result += `${str.slice(0, len - 2)}.${str.slice(len - 2)}`;
  }

  // 特殊数据处理：-0.00 => 0.00
  if (result === '-0.00') {
    result = '0.00';
  }

  // Trim zeros at the ending.
  if (trimZeros) {
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
