/**
 * 数字转十进制字符串，展开科学计数法
 *
 * @param {Number} num - 数字
 * @returns {String} 十进制字符串
 * @example
 *
 * expandNumber(1.5e-7)
 * // => 0.00000015
 *
 * expandNumber(-1.5e21)
 * // => -1500000000000000000000
 *
 * expandNumber('1e+21')
 * // => 1000000000000000000000
 *
 * expandNumber('0.123e2')
 * // => 12.3 前导零规范化
 */
export default function expandNumber(num) {
  const str = String(num);
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
