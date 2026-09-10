/**
 * 格式化数字，四舍五入保留 N 位小数
 *
 * @param {Number|String} value - 数字
 * @param {Object} options - 配置参数
 * @param {Number} [options.digit=2] - 保留小数位数
 * @param {Boolean} [options.cutZero=false] - 是否去掉小数末尾多余的零
 * @param {Boolean} [options.toThousands=false] - 是否使用千位分隔符
 * @param {String} [options.format=''] - 数据错误时返回的占位符
 * @returns {String}
 * @example
 *
 * toFixed(3.14159);
 * // => 3.14
 *
 * toFixed(3.14159, { digit: 3 });
 * // => 3.142
 *
 * toFixed(3);
 * // => 3.00
 *
 * toFixed('3.10', { cutZero: true }); // 去掉小数末尾多余的零
 * // => 3.1
 *
 * toFixed(3, { cutZero: true }); // 小数全为零时连小数点一并去掉
 * // => 3
 *
 * toFixed(1234567.89, { toThousands: true }); // 数字千位符分隔
 * // => 1,234,567.89
 *
 * toFixed(1.005); // 基于字面量四舍五入【(1.005).toFixed(2) => '1.00'】
 * // => 1.01
 *
 * toFixed(9.999); // 连锁进位
 * // => 10.00
 *
 * toFixed(1e-7); // 科学计数法先展开再转换
 * // => 0.00
 *
 * toFixed('-0.004'); // 负数按绝对值四舍五入，负零归一化为 0.00
 * // => 0.00
 *
 * toFixed('num'); // 错误数据
 * // => ''
 *
 * toFixed('num', { format: '--' }); // 错误数据返回占位符
 * // => '--'
 */
import { isNumber } from '../check/number';
import expandNumber from './expandNumber';

// 整体思路：全程十进制字符串运算，不整体转 Number，规避二进制近似误差
// 1. isNumber 白名单校验，非法值返回 format 占位符
// 2. 展开科学计数法、去前导 + 号、摘出负号，按绝对值四舍五入
// 3. 字符串逐位进位完成四舍五入，保留位数不足则补零
// 4. 依次去尾零【cutZero】、补回负号【归零不补，避免 -0.00】、千位分隔【toThousands】
export default function toFixed(value, options = {}) {
  const {
    digit = 2, // 保留小数位数
    cutZero = false, // 是否去掉小数末尾多余的零
    toThousands = false, // 是否使用千位分隔符
    format = '', // 数据错误时返回的占位符
  } = options || {}; // options 显式传 null 时解构会抛 TypeError，兜底为空对象
  if (!isNumber(value)) {
    return format;
  }
  // 保留位数仅接受 0-100 的整数【同原生 toFixed 合法区间，越界其抛 RangeError】，非法值回退默认 2
  const decimal = Number.isInteger(digit) && digit >= 0 && digit <= 100 ? digit : 2;

  // 先展开科学计数法【如 String(1e-7) => '1e-7'，展开后 => '0.0000001'】，再规范化前导 + 号【如 '+2000' => '2000'】
  let str = expandNumber(value).replace(/^\+/, '');
  // 负号先摘出，按绝对值四舍五入后再补回
  const negative = str[0] === '-';
  if (negative) {
    str = str.slice(1);
  }

  // 四舍五入思路：
  // 1. 小数位多于保留位数才需处理，看被舍弃的首位：< 5 直接截断
  // 2. >= 5 则在保留的最低位进一：整数与保留的小数拼成数字串做末位 +1，
  //    逢 9 连锁变 0，全为 9 时整体升一位
  // 3. 小数位不多于保留位数，末尾补零
  let [int, dec = ''] = str.split('.'); // 无小数点时 dec 取 ''
  if (dec.length > decimal) {
    if (Number(dec[decimal]) >= 5) { // 被舍弃的首位数字
      const digits = (int + dec.slice(0, decimal)).split('');
      let i = digits.length - 1;
      while (i >= 0 && digits[i] === '9') {
        digits[i] = '0'; // 逢 9 变 0，进位向前传
        i -= 1;
      }
      // while 的两个出口：停在非 9 位【i >= 0，进位落在这位】或走完整个数字串【i < 0，进位溢出最高位】
      if (i >= 0) {
        digits[i] = String(Number(digits[i]) + 1); // 停在非 9 位，+1 即止
      } else {
        digits.unshift('1'); // 全为 9，整体升一位【'999' + 1 => '1000'】
      }
      // 尾部 decimal 位是保留的小数，其余是整数【digit 为 0 时整串都是整数】
      const result = digits.join('');
      int = decimal > 0 ? result.slice(0, -decimal) : result;
      dec = decimal > 0 ? result.slice(-decimal) : '';
    } else {
      dec = dec.slice(0, decimal); // < 5 直接截断
    }
  } else {
    dec = dec.padEnd(decimal, '0'); // 保留位数不足补零
  }

  let result = decimal > 0 ? `${int}.${dec}` : int;
  // 去掉小数末尾多余的零，小数全为零时连小数点一并去掉
  if (cutZero) {
    result = result.match(/^[0-9]+(\.[0-9]*[1-9])?/)[0];
  }
  // 补回负号；四舍五入后归零时不补，避免出现 -0.00
  if (negative && !/^0(\.0+)?$/.test(result)) {
    result = `-${result}`;
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

// 原生取整的精度问题

// value.toFixed(2)
// 对二进制近似值取整，>= 1e21 时返回科学计数法
// (1.005).toFixed(2) = '1.00'（期望 '1.01'）
// (1.255).toFixed(2) = '1.25'（期望 '1.26'）
// (1e+21).toFixed(2) = '1e+21'

// Math.round(value * 100) / 100
// 放大运算引入浮点误差，负数取整方向也与四舍五入不符【Math.round(-100.5) => -100】
// Math.round(1.005 * 100) / 100 = 1（期望 1.01）
// Math.round(1.255 * 100) / 100 = 1.25（期望 1.26）
// Math.round(-1.005 * 100) / 100 = -1（期望 -1.01）
