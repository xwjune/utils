/**
 * 中文判断
 * 命中汉字【基本区、扩展 A、扩展 B 起代理对区及各兼容区】或中文专属符号【。，、（）￥㎡ 等】即真；
 * 中西共用符号不算中文【弯引号、破折号、省略号、全角字母数字等】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * hasChinese('中文');
 * // => true
 *
 * hasChinese('。');
 * // => true
 *
 * hasChinese('ＡＢＣ');
 * // => false
 */

// 中文区间【只收 CJK 专属区块；中西共用的通用标点 U+2000-206F 一律不收，否则纯西文带弯引号/零宽空格也会误判】
const RANGES = [
  '\u2E80-\u2EFF', // CJK 部首补充
  '\u2F00-\u2FDF', // 康熙字典部首
  '\u2FF0-\u2FFF', // 表意文字描述符
  '\u3000-\u303F', // CJK 符号和标点
  '\u31C0-\u31EF', // CJK 笔画
  '\u3300-\u33FF', // CJK 兼容【㎡㎞ 等单位符号】
  '\u3400-\u4DBF', // CJK 统一表意文字扩展 A
  '\u4E00-\u9FFF', // CJK 统一表意文字
  '\uF900-\uFAFF', // CJK 兼容表意文字
  '\uFE30-\uFE4F', // CJK 兼容形式【﹁﹏ 等竖排标点】
  // 全角标点【挖去全角数字、全角字母、半角片假名与 ￠￡￢￤ 等全角西文符号；FFE0-FFE6 只留 FFE5 ￥】
  '\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF60\uFFE5',
];

// 扩展 B 起的生僻字【如 𠮷 U+20BB7 即 D842+DFB7】为 UTF-16 代理对，占两个码元，单字符类无法匹配，
// 只能整对匹配：D840-D87E 是每对的前半（高码元），DC00-DFFF 是后半（低码元），
// 一前一后拼起来覆盖 U+20000-U+2FA1F【扩展 B-I 与兼容表意补充】
// 注意：严禁添加 'u' 标志，加了不报错，但代理对写法会静默失配【生僻字全部漏判】
const REGEXP = new RegExp(`(?:[${RANGES.join('')}]|[\uD840-\uD87E][\uDC00-\uDFFF])`);

export default function hasChinese(value) {
  // test 会将参数隐式转成字符串【数组、对象能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return REGEXP.test(value);
}
