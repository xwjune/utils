/**
 * cookie操作
 *
 * getCookie - 读取cookie
 * setCookie - 创建cookie
 * delCookie - 删除cookie
 */

/**
 * 读取cookie
 *
 * @param {String} name
 * @returns {String}
 */
export function getCookie(name) {
  const reg = new RegExp(`(^|\\s)${name}=([^;]*)(;|$)`);
  let result;
  try {
    result = document.cookie.match(reg)[2];
    result = decodeURIComponent(result);
  } catch (e) {
    result = null;
  }
  return result;
}

/**
 * 创建cookie
 *
 * @param {String} name - cookie名称
 * @param {String} value - cookie字符串值
 * @param {Object} [options={}] - 配置
 * @param {String} [options.domain] - 域名
 * @param {String} [options.path] - 路径
 * @param {Number} [options.maxAge] - 过期时间【单位是秒】
 * @param {Date} [options.expires] - 失效时间
 * @param {Boolean} [options.httpOnly] - 程序是否可读取到cookie信息【防止XSS攻击】
 * @param {Boolean} [options.secure] - 安全标志
 * @param {String} [options.sameSite] - 跨域安全机制
 * @example
 *
 * // 一天后过期
 * setCookie('name', 'value', {
 *   maxAge: 60 * 60 * 24,
 * });
 */
export function setCookie(name, value, options = {}) {
  if (!name) return;
  // options 显式传 null 时属性访问会抛 TypeError，兜底为空对象
  const opts = options || {};
  let str = `${name}=${encodeURIComponent(value)}`;

  if (opts.maxAge) {
    const exp = new Date();
    exp.setTime(exp.getTime() + opts.maxAge * 1000);
    opts.expires = exp;
  }

  if (opts.domain) {
    str += `; Domain=${opts.domain}`;
  }
  if (opts.path) {
    str += `; Path=${opts.path}`;
  }
  if (opts.expires) {
    str += `; Expires=${opts.expires.toUTCString()}`;
  }
  if (opts.httpOnly) {
    str += '; HttpOnly';
  }
  if (opts.secure) {
    str += '; Secure';
  }
  if (opts.sameSite) {
    str += `; SameSite=${opts.sameSite}`;
  }

  document.cookie = str;
}

/**
 * 删除cookie
 *
 * @param {String} name
 */
export function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const value = getCookie(name);
  if (value !== null) {
    document.cookie = `${name}=${value}; Expires=${exp.toUTCString()}`;
  }
}
