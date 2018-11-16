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
 * @param {String} money - 数字金额
 * @param {String} [format='零元整'] - 格式化
 * @returns {String} 中文金额
 * @example
 *
 * convertCurrency('0');
 * // => 零元整
 *
 * convertCurrency('');
 * // => 零元整
 *
 * convertCurrency('', '--');
 * // => --
 *
 * convertCurrency('100000000');
 * // => 壹亿元整
 *
 * convertCurrency('100000001');
 * // => 壹亿零壹元整
 *
 * convertCurrency('1.01');
 * // => 壹元零壹分
 *
 * convertCurrency('1.10');
 * // => 壹元壹角
 */
function convertCurrency(money, format = '零元整') {
  if (!/^-?(\d|[1-9]\d+)(\.\d+)?$/.test(money)) {
    return format;
  }
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 中文数字
  const radices = ['', '拾', '佰', '仟']; // 基本单位
  const bigRadices = ['', '万', '亿']; // 整数部分扩展单位
  const decRadices = ['角', '分']; // 小数部分扩展单位
  const cnDollar = '元'; // 金额整数部分后面跟的字符
  const cnInteger = '整'; // 整数金额时后面跟的字符
  const cnMinus = '负'; // 负数字符
  const cnMaxResult = '超大金额'; // 超过最大数的返回值
  const maxNum = 999999999999.99; // 最大的处理数字
  let integral = ''; // 金额整数部分
  let decimal = ''; // 金额小数部分
  let chineseStr = ''; // 返回的中文金额字符串

  money = money.toString();
  if (money[0] === '-') {
    chineseStr += cnMinus;
    money = money.substr(1);
  }
  // Greater than the maximum number.
  if (Number(money) > maxNum) {
    return cnMaxResult;
  }
  if (money.indexOf('.') === -1) {
    integral = money;
  } else {
    [integral, decimal] = money.split('.');
    // cut down redundant decimal digits that are after the second.
    decimal = decimal.substr(0, 2);
  }

  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
    let zeroCount = 0;
    for (let i = 0, intLen = integral.length; i < intLen; i++) {
      const p = intLen - i - 1; // 当前数字的坐标
      const d = integral.substr(i, 1); // 当前数字
      const m = p % 4;
      if (d === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += digits[0]; // 多个零合并显示
        }
        zeroCount = 0;
        chineseStr += digits[Number(d)] + radices[m];
      }
      // 整数部分扩展单位处理
      if (m === 0 && zeroCount < 4) {
        chineseStr += bigRadices[p / 4];
      }
    }
    chineseStr += cnDollar;
  }
  // Process decimal part:
  if (decimal !== '') {
    for (let i = 0, decLen = decimal.length; i < decLen; i++) {
      const d = decimal.substr(i, 1);
      const ds = decimal.substr(-1); // 小数末尾数值
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

  if (chineseStr === '' || chineseStr === cnMinus) {
  // 0、 -0、 0.0、 0.00
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

export default convertCurrency;

// 0 零元整
// 0.0 零元整
// 0.00 零元整
// -0.00 负零元整
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
