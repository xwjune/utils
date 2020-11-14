/**
 * 分->元
 * 为防止浮点数运算精度丢失，故采用字符串形式解析
 *
 * @param {Number} value - 分
 * @param {String} [format='0.00'] - 格式化
 * @param {Boolean} [cutZero=false] - 是否去掉小数末尾多余的零
 * @returns {String} 元
 * @example
 *
 * fenToYuan(2000);
 * // => 20.00
 *
 * fenToYuan(2000, '0', true); // 去掉小数末尾多余的零
 * // => 20
 *
 * fenToYuan(2000.45); // 非正确格式，舍去小数部分
 * // => 20.00
 *
 * fenToYuan();
 * // => 0.00
 *
 * fenToYuan(null, '--');
 * // => --
 */
export default function fenToYuan(value, format = '0.00', cutZero = false) {
  if (!/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value)) {
    return format;
  }

  let str = value.toString();
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

  if (cutZero) {
    // Cut zero at the ending.
    result = result.match(/-?[0-9]+(\.[0-9]*[1-9])?/)[0];
  }

  return result;
}
