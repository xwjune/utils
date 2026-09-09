/**
 * 邮箱校验
 * 规则：登录名@主机名.域名
 * 登录名可用字母、数字、_、-、+，点仅作分段符【不可在首尾或连续】；
 * 域名标签不可以连字符开头或结尾，点同样仅作分段符；
 * 顶级域为纯字母且至少 2 位【放行 .technology 等新顶级域】
 *
 * @param {*} value - The value to check.
 * @return {Boolean} Return `true` if validated, else `false`.
 * @example
 *
 * email('test@163.com');
 * // => true
 *
 * email('te_st@sima.vip.com');
 * // => true
 *
 * email('test+tag@163.com');
 * // => true
 *
 * email('test@163..com');
 * // => false
 */

// atext：登录名「一段」内的合法字符【RFC 5322 atext 常用子集，含 Gmail 式 + 别名】
// 注意它不是整个登录名——点不在其中，登录名 = 段(.段)*，点只在结构层作段间分隔
// 如此 .a、a.、a..b 这类点位置问题在结构上即不成立
const ATEXT = '[a-zA-Z0-9_+-]';
// 域名标签：须以字母数字开头结尾，连字符只能在中间【-163、163- 非法，单字符 a 合法】
const LABEL = '[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?';
// 末段 TLD 限纯字母，至少 2 位不封顶
const TLD = '[a-zA-Z]{2,}';
// 组装：登录名 = 段(.段)*，域名 = (标签.)+ 接 TLD
const REGEXP = new RegExp(`^${ATEXT}+(?:\\.${ATEXT}+)*@(?:${LABEL}\\.)+${TLD}$`);

export default function email(value) {
  // test 会将参数隐式转成字符串【单元素数组能误中，Symbol 直接抛错】，故仅接受字符串
  if (typeof value !== 'string') return false;
  return REGEXP.test(value);
}
