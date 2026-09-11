/**
 * cookie操作
 *
 * getCookie - 读取cookie
 * setCookie - 创建cookie
 * delCookie - 删除cookie
 */

// SSR/Node 等非浏览器环境没有 window/document，模块加载时探测一次，避免函数内裸访问抛 ReferenceError
const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

// cookie 里的非法字符：结构分隔符（; , = 空白）加 ASCII 控制字符，name/domain/path 共用一份规则
// eslint-disable-next-line no-control-regex
const INVALID_COOKIE_CHARS = /[\x00-\x1f\x7f;,=\s]/;

// value 契约是基本类型，其余类型经 encodeURIComponent 会写出误导性字面量：
// null/undefined 写成 'null'/'undefined' 字符串（读回来是真值，与真实存的值无法区分），
// 对象编码成 '%5Bobject%20Object%5D'，数组被拍平成 'a%2Cb'，故统一拒绝
function isValidCookieValue(value) {
  if (typeof value === 'number') {
    // NaN/Infinity 编码后是 'NaN'/'Infinity' 字面量，几乎必为上游计算错误，同样跳过
    return Number.isFinite(value);
  }
  return typeof value === 'string' || typeof value === 'boolean';
}

// name 契约：非空字符串且不含结构分隔符/控制字符，读写删三个 API 共用同一份规则
// typeof 先行：['a'] 会被隐式转成 'a' 混过字符检查，写出与调用本意不符的 cookie
function isValidCookieName(name) {
  return typeof name === 'string' && name !== '' && !INVALID_COOKIE_CHARS.test(name);
}

// 身份属性（domain/path）显式传入时必须精确可用，否则整单拒绝，写入/删除两侧共用
function hasInvalidIdentityAttrs(options) {
  const { domain, path } = options || {};
  // 类型：传了就必须是字符串，0/false/NaN/对象这类是调用方 bug，静默降级只会掩盖问题
  if (
    (path != null && typeof path !== 'string')
    || (domain != null && typeof domain !== 'string')
  ) return true;
  // 前缀：不以 / 开头的 Path 属性会被浏览器忽略（RFC 6265 §5.2.4），cookie 悄悄落到当前页面目录
  if (path && path.charAt(0) !== '/') return true;
  // 字符：注入字符会拆坏 cookie 串；未设置（null/undefined/''）给空串兜底，空串不含非法字符
  return INVALID_COOKIE_CHARS.test(path || '') || INVALID_COOKIE_CHARS.test(domain || '');
}

/**
 * 读取cookie
 *
 * 同名 cookie 写在多个 path/domain 下时，前端无法枚举区分；
 * 规范（RFC 6265 §5.4）建议浏览器按 path 长度降序返回（长的优先），但属 SHOULD 级建议，不可依赖。
 * 此时本函数返回 document.cookie 序列里的第一个命中，不保证是哪个 path/domain 的。
 *
 * @param {String} name - cookie名称
 * @returns {String|null} 解码后的值；空串 '' 也算命中；值不是编码产物时原样返回；未命中返回 null
 * @example
 * // 判存在请用 != null 而非真值判断：空值 cookie 命中返回 ''（falsy），真值判断会把「存在但为空」误判成「不存在」
 * setCookie('flag', '');
 * getCookie('flag');           // => ''（存在，但值为空）
 * getCookie('flag') != null;   // => true
 * Boolean(getCookie('flag'));  // => false（误判为不存在）
 */
export function getCookie(name) {
  // name 校验：名字里含结构分隔符的 cookie 写不进来，也就没必要去读
  if (!canUseDOM || !isValidCookieName(name)) return null;
  // name 中的正则元字符需转义，否则 a.b 这类名字会误匹配到 axb
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matched = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  if (!matched) return null;
  // 值不保证是编码产物（RFC 6265 不强制编码，服务端/第三方可能直写裸值），
  // 其中的 % 序列不合法（如 '50%off' 的 %of）时 decodeURIComponent 会抛 URIError，需兜底而非让读取方崩掉
  try {
    return decodeURIComponent(matched[1]);
  } catch {
    // 解码失败时原样返回
    return matched[1];
  }
}

/**
 * 创建cookie
 *
 * name 用 __Host-/__Secure- 前缀时需自行满足浏览器的附加要求
 * （__Host- 需 Secure + Path=/ + 无 Domain；__Secure- 需 Secure），不满足时浏览器会拒绝写入，本库不额外校验
 *
 * @param {String} name - cookie名称
 * @param {String|Number|Boolean} value - cookie值（仅接受基本类型，对象请先 JSON.stringify）
 * @param {Object} [options={}] - 配置
 * @param {String} [options.domain] - 域名
 * @param {String} [options.path='/'] - 路径，默认根路径；显式传入时必须以 / 开头，否则整单拒绝
 * @param {Number} [options.maxAge] - 相对过期时间【单位是秒，0 表示立即失效；与 expires 同时传时以 maxAge 为准，建议二选一】
 * @param {Date} [options.expires] - 绝对失效时间
 * @param {Boolean} [options.secure] - 安全标志
 * @param {String} [options.sameSite] - 跨域安全机制，仅接受 Strict/Lax/None（大小写不敏感）
 * @example
 * // 一天后过期
 * setCookie('name', 'value', {
 *   maxAge: 60 * 60 * 24,
 * });
 */
export function setCookie(name, value, options = {}) {
  // name 含 ; , = 空白或控制字符会把 cookie 串拆坏（如 'a;b' 实际写入的是空值 a），跳过
  // value 只接受基本类型，null/undefined/对象编码后是垃圾字面量，同样跳过
  // 非浏览器环境（SSR/Node）无 window/document，同样跳过
  if (!canUseDOM || !isValidCookieName(name) || !isValidCookieValue(value)) return;
  // 身份属性必须精确，非法整单拒绝；maxAge/expires/sameSite 等行为属性才允许静默忽略
  if (hasInvalidIdentityAttrs(options)) return;
  const opts = options || {};
  let str = `${name}=${encodeURIComponent(value)}`;

  if (opts.domain) {
    str += `; Domain=${opts.domain}`;
  }
  // path 不用浏览器默认的「当前页面目录」，显式统一为 /，保证读写删三处路径一致
  str += `; Path=${opts.path || '/'}`;
  // 用 != null 而非真值判断：maxAge: 0 是「立即失效」的合法值，若写成 if (opts.maxAge)，
  // 0 是 falsy，会和「没传」一起被挡在分支外，立即失效的语义就丢了
  if (opts.maxAge != null) {
    // RFC 6265 里 Max-Age 是整数秒，向下取整；负数保留（浏览器视为立即失效）
    // 只认 number 和非空数字字符串：true/[]/'' 经 Number() 也能转出数值（[] 和 '' 都转成 0，
    // 等于把 cookie 直接写没），属调用方 bug，拒绝而非猜
    const raw = opts.maxAge;
    const seconds = typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '')
      ? Math.floor(Number(raw))
      : NaN;
    // 转不成有限数值（如 'abc'）时浏览器会忽略整个属性，直接不写
    if (Number.isFinite(seconds)) {
      str += `; Max-Age=${seconds}`;
    }
  }
  // 契约是 Date；非 Date（如手滑传 ISO 字符串/时间戳）忽略而非抛错
  // Invalid Date（如 new Date('invalid')、new Date(NaN)）是真实存在的 Date 实例，'[object Date]' 判别照样通过，
  // 唯一破绽是 getTime() 为 NaN：toUTCString() 只输出 'Invalid Date' 字面量，被浏览器忽略、落成会话 cookie
  if (Object.prototype.toString.call(opts.expires) === '[object Date]'
    && !Number.isNaN(opts.expires.getTime())) {
    str += `; Expires=${opts.expires.toUTCString()}`;
  }
  // 只放行 Strict/Lax/None（大小写不敏感），白名单外的值浏览器本来就会忽略，直接不写；统一输出首字母大写的规范形式
  if (opts.sameSite && /^(strict|lax|none)$/i.test(opts.sameSite)) {
    // String() 不是冗余：['lax'] 这类值能通过上面的正则（隐式转换成 'lax'），但没有 toLowerCase，需先转原始字符串
    const site = String(opts.sameSite).toLowerCase();
    str += `; SameSite=${site.charAt(0).toUpperCase()}${site.slice(1)}`;
  }
  // SameSite=None 不带 Secure 会被 Chrome 80+/Firefox/Safari 直接拒绝写入，这里自动补上
  if (opts.secure || /^none$/i.test(opts.sameSite || '')) {
    str += '; Secure';
  }

  document.cookie = str;
}

/**
 * 删除cookie
 *
 * @param {String} name - cookie名称
 * @param {Object} [options={}] - 配置，path/domain 需与写入时一致才能删掉
 * @param {String} [options.domain] - 域名
 * @param {String} [options.path] - 路径（以 / 开头），需与写入时一致才能删掉；不传时删根路径与当前页面目录两处
 */
export function delCookie(name, options = {}) {
  // name 校验与 setCookie 同一份规则
  if (!canUseDOM || !isValidCookieName(name)) return;
  // 删除必须精确匹配目标，身份属性非法直接拒绝（与 setCookie 的写入侧规则对称，null 兜底同上）
  if (hasInvalidIdentityAttrs(options)) return;
  const opts = options || {};
  // Max-Age=0 与 1970 元年双保险：RFC 6265 里 Max-Age 优先级高于 Expires，个别环境对 Expires 解析有坑
  const expired = { maxAge: 0, expires: new Date(0), domain: opts.domain };
  if (opts.path) {
    setCookie(name, '', { ...expired, path: opts.path });
    return;
  }
  // 未指定 path：先删根路径（与 setCookie 默认 path 对齐）
  setCookie(name, '', { ...expired, path: '/' });
  // 未传 path 才走到这里：再按当前页面目录删一次，兜底旧版本以浏览器默认路径（当前目录）写入的存量 cookie
  const dir = window.location.pathname.replace(/\/[^/]*$/, '') || '/';
  if (dir !== '/') {
    setCookie(name, '', { ...expired, path: dir });
  }
}
