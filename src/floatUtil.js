/**
 * 浮点数运算【解决精度问题】
 *
 * add - 加法
 * subtract - 减法
 * multiply - 乘法
 * divide - 除法
 */
/* eslint-disable no-mixed-operators */
import { isNumber } from './check/number';

/**
 * 通用运算
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
  let t1;
  let t2;

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

  const m = 10 ** Math.max(t1, t2);
  const cm = 10 ** Math.abs(t1 - t2);
  r1 = Number(r1.replace('.', ''));
  r2 = Number(r2.replace('.', ''));
  if (t1 > t2) {
    r2 *= cm;
  } else if (t1 < t2) {
    r1 *= cm;
  }

  switch (type) {
    case 'add':
      result = (r1 + r2) / m;
      break;
    case 'subtract':
      result = (r1 - r2) / m;
      break;
    case 'divide':
      result = r1 / r2;
      break;
    // no default
  }

  return result;
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
  let m = 0;

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

  return Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / (10 ** m);
}

export default {
  /**
   * 加法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 格式化
   * @returns {Number|String} 运算结果
   */
  add(arg1, arg2, format = '') {
    if (isNumber(arg1, false) && isNumber(arg2, false)) {
      return operation(arg1, arg2, 'add');
    }
    return format;
  },
  /**
   * 减法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 格式化
   * @returns {Number|String} 运算结果
   */
  subtract(arg1, arg2, format = '') {
    if (isNumber(arg1, false) && isNumber(arg2, false)) {
      return operation(arg1, arg2, 'subtract');
    }
    return format;
  },
  /**
   * 乘法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 格式化
   * @returns {Number|String} 运算结果
   */
  multiply(arg1, arg2, format = '') {
    if (isNumber(arg1, false) && isNumber(arg2, false)) {
      return multiply(arg1, arg2);
    }
    return format;
  },
  /**
   * 除法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 格式化
   * @returns {Number|String} 运算结果
   */
  divide(arg1, arg2, format = '') {
    if (isNumber(arg1, false) && isNumber(arg2, false)) {
      return operation(arg1, arg2, 'divide');
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
