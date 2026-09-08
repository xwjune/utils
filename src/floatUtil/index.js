/* eslint-disable no-mixed-operators */
/**
 * 浮点数运算【解决精度问题】
 *
 * add - 加法
 * subtract - 减法
 * multiply - 乘法
 * divide - 除法
 *
 * 仅接受十进制字面量【1e-7、1e+21 等以科学计数法表示的数字除外】；
 * 运算中间值超出 Number.MAX_SAFE_INTEGER 时无法保证精度，与非法输入一样返回 format 兜底
 */
import { isDecimalNumber } from '../check/number';

/**
 * 通用运算
 * 思路：按小数位数把两数放大为整数运算，再将结果缩回，规避浮点数的表示误差
 *
 * @param {Number} arg1 - 运算数1
 * @param {Number} arg2 - 运算数2
 * @param {String} type - 运算类型【add-加法、subtract-减法、divide-除法】
 * @returns {Number} 运算结果
 */
function operation(arg1, arg2, type) {
  let r1 = arg1.toString();
  let r2 = arg2.toString();
  let result;
  let t1; // arg1 的小数位数
  let t2; // arg2 的小数位数

  try {
    t1 = r1.split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = r2.split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }

  // m - 放大倍数【按较长的小数位把两数放大为整数】
  // cm - 对齐倍数【把小数位较少的一方补齐到相同位数】
  const m = 10 ** Math.max(t1, t2);
  const cm = 10 ** Math.abs(t1 - t2);
  // 去掉小数点即完成放大【'2.22' => 222】
  r1 = Number(r1.replace('.', ''));
  r2 = Number(r2.replace('.', ''));
  if (t1 > t2) {
    r2 *= cm;
  } else if (t1 < t2) {
    r1 *= cm;
  }

  // 放大后的操作数 超出 Number.MAX_SAFE_INTEGER 时已不精确，返回 undefined 交由上层兜底
  if (!Number.isSafeInteger(r1) || !Number.isSafeInteger(r2)) {
    return undefined;
  }

  switch (type) {
    case 'add':
      result = r1 + r2;
      break;
    case 'subtract':
      result = r1 - r2;
      break;
    case 'divide':
      // 放大倍数在分子分母同乘抵消，无需除回 m；商一般不是整数，也不适用下方的安全整数检查。
      // r1、r2 已是精确整数，单次除法得到的即为最接近真值的 double
      return r1 / r2;
    // no default
  }

  // 加减中间结果同样不能超出安全整数范围【安全整数对加减不封闭，
  // 如 MAX_SAFE_INTEGER + (MAX_SAFE_INTEGER - 1) 实际会差 1】；
  // 10 ** m 溢出为 Infinity 时，还原会让结果错误地变成 0
  if (!Number.isFinite(m) || !Number.isSafeInteger(result)) {
    return undefined;
  }

  // 除回放大倍数，还原为小数【(222 + 10) / 100 => 2.32】
  return result / m;
}

/**
 * 乘法
 *
 * @param {Number} arg1 - 运算数1
 * @param {Number} arg2 - 运算数2
 * @returns {Number} 运算结果
 */
function multiply(arg1, arg2) {
  const r1 = arg1.toString();
  const r2 = arg2.toString();
  let m = 0; // 两数小数位数之和

  try {
    m += r1.split('.')[1].length;
  } catch (e) {
    m += 0;
  }
  try {
    m += r2.split('.')[1].length;
  } catch (e) {
    m += 0;
  }

  const n1 = Number(r1.replace('.', ''));
  const n2 = Number(r2.replace('.', ''));
  const d = 10 ** m;

  // 因子或乘积超出 Number.MAX_SAFE_INTEGER【安全整数对乘法不封闭】、
  // 10 ** m 溢出时无法保证精度，返回 undefined 交由上层兜底
  if (
    !Number.isFinite(d)
    || !Number.isSafeInteger(n1)
    || !Number.isSafeInteger(n2)
    || !Number.isSafeInteger(n1 * n2)
  ) {
    return undefined;
  }

  // 除回放大倍数，还原为小数【199 * 100 / 10 => 1990】
  return (n1 * n2) / d;
}

export default {
  /**
   * 加法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 非法输入或超出安全整数范围时的兜底返回值
   * @returns {Number|String} 运算结果
   */
  add(arg1, arg2, format = '') {
    if (isDecimalNumber(arg1) && isDecimalNumber(arg2)) {
      return operation(arg1, arg2, 'add') ?? format;
    }
    return format;
  },
  /**
   * 减法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 非法输入或超出安全整数范围时的兜底返回值
   * @returns {Number|String} 运算结果
   */
  subtract(arg1, arg2, format = '') {
    if (isDecimalNumber(arg1) && isDecimalNumber(arg2)) {
      return operation(arg1, arg2, 'subtract') ?? format;
    }
    return format;
  },
  /**
   * 乘法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 非法输入或超出安全整数范围时的兜底返回值
   * @returns {Number|String} 运算结果
   */
  multiply(arg1, arg2, format = '') {
    if (isDecimalNumber(arg1) && isDecimalNumber(arg2)) {
      return multiply(arg1, arg2) ?? format;
    }
    return format;
  },
  /**
   * 除法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 非法输入、除数为 0 或超出安全整数范围时的兜底返回值
   * @returns {Number|String} 运算结果
   */
  divide(arg1, arg2, format = '') {
    // 除数为 0【结果为 Infinity/NaN】时同样走兜底
    if (isDecimalNumber(arg1) && isDecimalNumber(arg2) && Number(arg2) !== 0) {
      return operation(arg1, arg2, 'divide') ?? format;
    }
    return format;
  },
};

// 浮点数运算精度丢失案例

// 加法
// 0.1 + 0.2 = 0.30000000000000004
// 0.7 + 0.1 = 0.7999999999999999
// 0.2 + 0.4 = 0.6000000000000001
// 2.22 + 0.1 = 2.3200000000000003

// 减法
// 1.5 - 1.2 = 0.30000000000000004
// 0.3 - 0.2 = 0.09999999999999998

// 乘法
// 19.9 * 100 = 1989.9999999999998
// 0.7 * 180 = 125.99999999999999
// 9.7 * 100 = 969.9999999999999
// 39.7 * 100 = 3970.0000000000005

// 除法
// 0.3 / 0.1 = 2.9999999999999996
// 0.69 / 10 = 0.06899999999999999
// 11.2 / 100 = 0.11199999999999999
