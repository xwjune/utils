/**
 * 数字转十进制字符串，展开科学计数法
 *
 * @param {number|string} value - 数字或数字字面量字符串
 * @returns {string} 十进制字符串
 * @example
 *
 * expandNumber(1.5e-7);
 * // => 0.00000015
 *
 * expandNumber(-1.5e-7);
 * // => -0.00000015
 *
 * expandNumber(1.5e21);
 * // => 1500000000000000000000
 *
 * expandNumber(-1.5e21);
 * // => -1500000000000000000000
 *
 * expandNumber(1.5); // 非科学计数法原样返回
 * // => 1.5
 *
 * expandNumber('12.34e1'); // 字符串科学计数法同样支持
 * // => 123.4
 *
 * expandNumber('0.123e2'); // 前导零规范化
 * // => 12.3
 *
 * expandNumber(Symbol('x')); // 非数字/字符串直接抛 TypeError
 */
export default function expandNumber(value) {
  // String() 对任何类型都来者不拒【[1e-7] 会隐式转成 '1e-7' 照样展开】，其余类型是调用方 bug，直接抛错
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new TypeError('expandNumber 的参数必须是数字或字符串');
  }
  const str = String(value);
  if (!/e/i.test(str)) {
    return str;
  }
  const negative = str[0] === '-';
  const [mantissa, exponent] = (negative ? str.slice(1) : str).split(/e/i);
  const [int, dec = ''] = mantissa.split('.');
  const digits = int + dec;
  const pointPos = int.length + Number(exponent); // 展开后小数点在数字串中的位置
  let plainStr;
  if (pointPos <= 0) {
    plainStr = `0.${'0'.repeat(-pointPos)}${digits}`;
  } else if (pointPos >= digits.length) {
    plainStr = `${digits}${'0'.repeat(pointPos - digits.length)}`;
  } else {
    plainStr = `${digits.slice(0, pointPos)}.${digits.slice(pointPos)}`;
  }
  // 纯小数尾数右移小数点会产生前导零，去掉多余的 0【'0.123e2' => '012.3' => '12.3'】
  return (negative ? `-${plainStr}` : plainStr).replace(/^(-?)0+(?=\d)/, '$1');
}
