'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 浮点数运算【解决精度问题】
 *
 * add - 加法
 * subtract - 减法
 * multiply - 乘法
 * divide - 除法
 */

/**
 * 通用运算
 *
 * @param {Number} arg1 - 运算数1
 * @param {Number} arg2 - 运算数2
 * @param {String} type - 运算类型【add-加法、subtract-减法、divide-除法】
 * @returns {Number} 运算结果
 */
function operation(arg1, arg2, type) {
  var r1 = arg1.toString();
  var r2 = arg2.toString();
  var result = void 0;
  var t1 = void 0;
  var t2 = void 0;
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
  var m = Math.pow(10, Math.max(t1, t2));
  var cm = Math.pow(10, Math.abs(t1 - t2));
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
    default:
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
function _multiply(arg1, arg2) {
  var r1 = arg1.toString();
  var r2 = arg2.toString();
  var m = 0;
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
  return Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m);
}

/**
 * 数字判断
 *
 * @param {Number} value - 数字
 * @returns {Boolean}
 */
function isNumber(value) {
  return (/^-?(\d|[1-9]\d+)(\.\d+)?$/.test(value)
  );
}

exports.default = {
  /**
   * 加法
   *
   * @param {Number} arg1 - 运算数1
   * @param {Number} arg2 - 运算数2
   * @param {String} [format=''] - 格式化
   * @returns {Number|String} 运算结果
   */
  add: function add(arg1, arg2) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (isNumber(arg1) && isNumber(arg2)) {
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
  subtract: function subtract(arg1, arg2) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (isNumber(arg1) && isNumber(arg2)) {
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
  multiply: function multiply(arg1, arg2) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (isNumber(arg1) && isNumber(arg2)) {
      return _multiply(arg1, arg2);
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
  divide: function divide(arg1, arg2) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (isNumber(arg1) && isNumber(arg2)) {
      return operation(arg1, arg2, 'divide');
    }
    return format;
  }
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