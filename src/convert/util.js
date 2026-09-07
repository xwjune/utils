/**
 * convert 内部公共工具【不作为公开 API 导出】
 */

/**
 * 数字转十进制字符串，展开科学计数法【如 1.5e-7 => '0.00000015'】
 *
 * @param {Number} num - 数字
 * @returns {String} 十进制字符串
 */
export function expandNumber(num) {
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
  return negative ? `-${plainStr}` : plainStr;
}
