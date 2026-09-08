/**
 * 数字金额转换为中文人民币大写
 * 最大处理数字：999999999999.99
 *
 * 中文大写金额数字到“元”为止的，在“元”之后、应写“整”(或“正”)字；
 * 在“角”之后，可以不写“整”(或“正”)字；
 * 大写金额数字有“分”的，“分”后面不写“整”(或“正”)字。
 * 阿拉伯数字小写金额数字中有“0”时，中文大写应按照汉语语言规律、金额数字构成和防止涂改的要求进行书写。举例如下：
 *   1、阿拉伯数字中间有“0”时，中文大写要写“零”字，如￥1409.50应写成人民币壹仟肆佰零玖元伍角。
 *   2、阿拉伯数字中间连续有几个“0”时，中文大写金额中间可以只写一个“零”字，如￥6007.14应写成人民币陆仟零柒元壹角肆分。
 *   3、阿拉伯金额数字万位和元位是“0”，或者数字中间连续有几个“0”，万位、元位也是“0”但千位、角位不是“0”时，中文大写金额中可以只写一个零字，也可以不写“零”字。
 *     如￥1680.32应写成人民币壹仟陆佰捌拾元零叁角贰分，或者写成人民币壹仟陆佰捌拾元叁角贰分。
 *     又如￥107000.53应写成人民币壹拾万柒仟元零伍角叁分，或者写成人民币壹拾万零柒仟元伍角叁分。
 *   4、阿拉伯金额数字角位是“0”而分位不是“0”时，中文大写金额“元”后面应写“零”字。如￥16409.02应写成人民币壹万陆仟肆佰零玖元零贰分。
 *
 * @param {Number} value - 数字金额
 * @param {String} [format='零元整'] - 空数据格式化
 * @returns {String} 中文金额
 * @example
 *
 * currencyToCn(0);
 * // => 零元整
 *
 * currencyToCn();
 * // => 零元整
 *
 * currencyToCn('', '--');
 * // => --
 *
 * currencyToCn('1x');
 * // => 数据错误
 *
 * currencyToCn(100000000);
 * // => 壹亿元整
 *
 * currencyToCn(100000001);
 * // => 壹亿零壹元整
 *
 * currencyToCn(999999999999.99);
 * // => 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分
 *
 * currencyToCn(1.01);
 * // => 壹元零壹分
 *
 * currencyToCn(1.10);
 * // => 壹元壹角
 */
import expandNumber from './expandNumber';
import numberToCn from './numberToCn';

export default function currencyToCn(value, format = '零元整') {
  if (
    value === undefined
    || value === null
    || value === ''
  ) {
    return format;
  }

  // Number 先展开为十进制字符串，避免科学计数法【如 String(1e-7) === '1e-7'】被误判为数据错误
  const str = typeof value === 'number' ? expandNumber(value) : value;
  if (!/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(str)) {
    return '数据错误';
  }

  const [
    integral, // 金额整数部分
    fullDecimal = '', // 完整小数部分
  ] = str.split('.');
  // 边界值校验
  // 不用 Number(value) > 999999999999.99 判断：双精度浮点只有约15~16位十进制有效数字，
  // 上限附近的最小精度间隔约0.000122，字符串转 Number 会发生舍入——
  // 如 '999999999999.990001' 实际大于上限，舍入后却与上限相等，'>' 不成立而被漏放。
  // 入参字符串本身就是精确值，按位数比较无精度问题：
  // 整数达13位即超限；整数恰为999999999999时，小数前两位为99且第三位起还有非零数字即超限
  if (
    integral.length > 12
    || (
      integral === '999999999999'
      && fullDecimal.slice(0, 2) === '99'
      && Number(fullDecimal.slice(2)) > 0
    )
  ) {
    return '超大金额';
  }

  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 中文数字
  const decRadices = ['角', '分']; // 小数部分扩展单位
  const cnDollar = '元'; // 金额整数部分后面跟的字符
  const cnInteger = '整'; // 整数金额时后面跟的字符
  let chineseStr = ''; // 返回的中文金额字符串

  // cut down redundant decimal digits that are after the second.
  const decimal = fullDecimal.slice(0, 2); // 金额小数部分【两位】

  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
    chineseStr += numberToCn(integral);
    chineseStr += cnDollar;
  }
  // Process decimal part:
  if (decimal !== '') {
    const ds = decimal.substr(-1); // 小数末尾数值
    for (let i = 0, decLen = decimal.length; i < decLen; i++) {
      const d = decimal[i]; // 当前数字
      if (d === '0') {
        // 特殊数据处理：x.0【不显示小数】、 x.00【不显示小数】、 x.10【不显示分位】
        if (ds !== '0') {
          chineseStr += digits[Number(d)];
        }
      } else {
        chineseStr += digits[Number(d)] + decRadices[i];
      }
    }
  }

  if (chineseStr === '') {
  // 0、 0.0、 0.00
    chineseStr += digits[0] + cnDollar + cnInteger;
  } else if (
    decimal === ''
    || decimal === '0'
    || decimal === '00'
  ) {
  // 整数、 x.0、 x.00
    chineseStr += cnInteger;
  }

  return chineseStr;
}

// 0 零元整
// 0.0 零元整
// 0.00 零元整
// 0.01 零壹分
// 0.10 壹角
// 1.01 壹元零壹分
// 1.10 壹元壹角
// 1.00 壹元整
// 1.0 壹元整
// 100 壹佰元整【省略零】
// 10000 壹万元整
// 10001 壹万零壹元整【合并零】
// 100001 壹拾万零壹元整
// 10000010 壹仟万零壹拾元整
// 100000000 壹亿元整【省略中间所有零】
// 100000001 壹亿零壹元整【中间省略万】
// 999999999999.99 玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分
// 0.0000001 零元整【Number 科学计数法自动展开，金额只精确到分】
// 1e21 超大金额【Number 科学计数法自动展开】
// 999999999999.990001 超大金额【按字符串比较，不受浮点进位影响】
