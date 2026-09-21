/**
 * 数字金额转换为中文人民币大写
 *
 * 最大处理数字 999999999999.99；分位以下小数直接截断。书写规则：
 * - 补「整」：无角无分时以「整」收尾，有角或有分不缀
 * - 读「零」：数位中间的 0 读一个「零」（连续 0 合并）；角位为 0 而分位非 0 时补「零」衔接元与分（不足一元时该「零」即为开头）
 * - 省「零」：数级（个/万/亿）末尾的 0 不读；万级全为 0 时连级名「万」一并省略
 *
 * @param {number} value - 数字金额
 * @param {string} [format='零元整'] - 空数据格式化
 * @returns {string} 中文金额
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
 * currencyToCn(1.00);
 * // => 壹元整
 *
 * currencyToCn(1.01);
 * // => 壹元零壹分
 *
 * currencyToCn(1.10);
 * // => 壹元壹角
 *
 * currencyToCn(1.11);
 * // => 壹元壹角壹分
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
 * currencyToCn(1000000000000); // 超出上限
 * // => 超大金额
 */
import expandNumber from './expandNumber';
import numberToCn from './numberToCn';

// 字表与「零元整」提为模块级常量：默认参数在函数体作用域之外求值，取不到函数体内的声明
const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 中文数字
const cnYuan = '元'; // 元位单位
const cnJiao = '角'; // 角位单位
const cnFen = '分'; // 分位单位
const cnZheng = '整'; // 无角无分时的收尾字
const cnZero = digits[0] + cnYuan + cnZheng; // 零元整

export default function currencyToCn(value, format = cnZero) {
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
  // 边界值校验：不用 Number(value) > 上限判断——双精度有效数字仅约 15~16 位，上限附近转 Number 会舍入，
  // 如 '999999999999.990001' 实际超限，舍入后却与上限相等，'>' 不成立而漏放；按字符串位数比较则精确无舍入：
  // 整数达 13 位即超限；整数恰为 999999999999 时，小数前两位为 99 且其后仍有非零数字即超限
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

  let chineseStr = ''; // 返回的中文金额字符串
  // 截去第二位之后的多余小数位，金额只精确到分【直接截断丢弃，不四舍五入】
  const decimal = fullDecimal.slice(0, 2); // 金额小数部分【两位】

  // 处理整数部分：非零才读并缀「元」，为零不输出——不足一元无元位
  if (Number(integral) > 0) {
    chineseStr += numberToCn(integral);
    chineseStr += cnYuan;
  }
  // 处理小数部分：角/分先取数值再分支，特殊形态由分支条件自然消解
  // x.0、x.00 角分皆零不输出；x.10 分位为零不读；x.05 角位为零补零衔接元与分
  const jiao = Number(decimal[0]) || 0; // 角位数值
  const fen = Number(decimal[1]) || 0; // 分位数值
  if (jiao > 0) {
    chineseStr += digits[jiao] + cnJiao;
  } else if (fen > 0) {
    // 角位为零但有分时补零：整数非零落在元与分之间衔接（1.05 => 壹元零伍分）；
    // 整数为零时无元可衔接、该零成为开头（0.05 => 零伍分）
    chineseStr += digits[0];
  }
  if (fen > 0) {
    chineseStr += digits[fen] + cnFen;
  }

  if (chineseStr === '') {
    // 整数、角、分皆零（0、0.0、0.00），三段拼接全空，取零元整
    chineseStr = cnZero;
  } else if (
    decimal === ''
    || decimal === '0'
    || decimal === '00'
  ) {
    // 无角无分（整数、x.0、x.00），缀整收尾
    chineseStr += cnZheng;
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
// 1.11 壹元壹角壹分
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
