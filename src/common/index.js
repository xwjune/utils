/* eslint-disable no-bitwise */
/**
 * 通用方法
 */

/**
 * 生成 uuid（RFC 9562 v4 格式）
 *
 * 按环境随机源能力分层：crypto.randomUUID（现代浏览器安全上下文如 https/localhost、Node 19+）直接委托，密码学安全；
 * 无 randomUUID 时用 crypto.getRandomValues（同为密码学安全，且不限安全上下文，如纯 http 页面）；
 * 两者都没有才退回 Math.random——非密码学安全，仅可用作去重 key、trace id 等，不能当 token 或密钥
 *
 * @return {string} uuid
 * @example
 *
 * generateUUID();
 * // => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
 */
// xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
// M 的四位是版本（本实现固定 4，即 v4），N 的最高两位是变体（钉死 10xx，故该位只会是 8/9/a/b）
function generateUUID() {
  // 首选 crypto.randomUUID：非安全上下文（纯 http 页面）与老环境没有
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // 次选 crypto.getRandomValues：randomUUID 缺席时它往往还在（纯 http 页面即非安全上下文），同为密码学安全
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // 钉死版本位 4 与变体位 10xx（位布局见函数头注释），其余位保持随机
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');
  }
  // 兜底 Math.random：非密码学安全，仅可用作去重 key、trace id 等，不能当 token 或密钥
  // 模板沿用网络流传的经典写法：x 是随机位，y 即函数头注释里的 N 位
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; // 0-15 对应16进制 0-f
    // eslint-disable-next-line no-mixed-operators
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * 获取 url 中的参数
 *
 * 在完整链接里取第一个命中的参数（同名取先出现的），hash 段里的 query 同样能取到。
 * 参数名区分大小写、按字面匹配不解码（?arr%5B%5D=1 需传编码名查询）；无等号的裸参数视为不存在。
 * 值按 decodeURIComponent 解码：'+' 不转空格；非法 % 序列原样返回、不抛错。
 * 非浏览器环境（SSR）无 window，不传 url 时抛 ReferenceError，须显式传入。
 *
 * @param {string} name - 参数名；非字符串、空串或含 & = # 时抛 TypeError
 * @param {string} [url=window.location.search] - 链接；非字符串时抛 TypeError
 * @return {string|null} 解码后的参数值；参数存在但值为空返回 ''；未命中返回 null
 * @example
 *
 * // 基础取值
 * getParameter('name', 'http://www.w3school.com?name=xxx');
 * // => xxx
 *
 * // 不传 url 则读当前页面地址（SSR 无 window 会抛 ReferenceError，须显式传入）
 * getParameter('name');
 *
 * // 同名参数取先出现的
 * getParameter('name', 'http://www.w3school.com?name=a&name=b');
 * // => a
 *
 * // 参数名区分大小写，'?Name' 与 'name' 是不同参数
 * getParameter('name', 'http://www.w3school.com?Name=xxx');
 * // => null
 *
 * // hash 段里的 query 同样能取到（SPA 路由）
 * getParameter('name', 'http://www.w3school.com?age=12#/main?name=xxx');
 * // => xxx
 *
 * // 参数名不解码，编码名需传编码形式
 * getParameter('arr%5B%5D', 'http://www.w3school.com?arr%5B%5D=1');
 * // => 1
 *
 * // 参数存在但值为空返回 ''（判存在用 != null，'' 是 falsy，真值判断会误判成不存在）
 * getParameter('name', 'http://www.w3school.com?name=');
 * // => ''
 *
 * // 链接里没有该参数返回 null
 * getParameter('name', 'http://www.w3school.com');
 * // => null
 *
 * // 无等号的裸参数（?flag）同样视为不存在
 * getParameter('flag', 'http://www.w3school.com?flag');
 * // => null
 *
 * // 值里的合法编码会被解码
 * getParameter('name', 'http://www.w3school.com?name=a%20b');
 * // => a b
 *
 * // '+' 不转空格（区别于 URLSearchParams 语义）
 * getParameter('q', 'http://www.w3school.com?q=a+b');
 * // => a+b
 *
 * // 值含非法 % 序列时不抛错，原样返回不解码
 * getParameter('name', 'http://www.w3school.com?name=50%off');
 * // => 50%off
 *
 * // name 非字符串抛 TypeError（空串或含 & = # 同样抛）
 * getParameter(123, '?a=1');
 * // => throw Error（getParameter 的 name 必须是字符串）
 *
 * // url 非字符串抛 TypeError（显式传 null 不等于不传，同样抛）
 * getParameter('a', null);
 * // => throw Error（getParameter 的 url 必须是字符串）
 */
function getParameter(name, url = window.location.search) {
  // 非字符串是调用方 bug：['a'] 会被转成 'a' 照样查出值，错误被掩盖
  if (typeof name !== 'string') {
    throw new TypeError('getParameter 的 name 必须是字符串');
  }
  // 空 name 与含 & = #（query 结构字符）的 name 不可能真实存在，属调用方 bug
  if (name === '' || /[&#=]/.test(name)) {
    throw new TypeError('getParameter 的 name 不能为空，也不能包含 & = #');
  }
  // url 同 name：隐式转换让非字符串静默失败或碰巧命中，bug 不暴露
  if (typeof url !== 'string') {
    throw new TypeError('getParameter 的 url 必须是字符串');
  }
  // name 中的正则元字符需转义，否则 a.b 会误匹配到 axb
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 不带 i：参数名区分大小写（与 URLSearchParams 一致），'?Name' 与 'name' 是不同参数
  const regexp = new RegExp(`[?&]${escaped}=([^&#]*)`);
  const result = regexp.exec(url);
  if (result === null) return null;
  // 值不保证是编码产物（query 可能直写裸 %），非法 % 序列（如 '50%off'）会让 decodeURIComponent 抛 URIError，兜底原样返回
  try {
    return decodeURIComponent(result[1]);
  } catch {
    return result[1];
  }
}

// 可选回调契约：null/undefined 视为不传，其余类型是调用方 bug，抛错而非静默吞掉
function assertOptionalCallback(name, fn) {
  if (fn != null && typeof fn !== 'function') {
    throw new TypeError(`loadScript 的 ${name} 只接受函数`);
  }
}

/**
 * 动态加载 js
 *
 * 成功加载并执行完后触发 onSuccess，失败（404、网络错误）触发 onError，均不传参；失败节点移出 DOM，成功的保留。
 * onSuccess/onError 可选：null/undefined 视为不传，其余非函数抛 TypeError。
 * 不查重：同 url 重复调用会重复执行；动态插入的 script 默认 async，并发调用不保证顺序，有顺序依赖时在上一个的 onSuccess 里再发起。
 * 老 IE 分支区分不了失败：出错也照样当成功触发 onSuccess，onError 与失败移除节点不生效；个别版本回调可能早于脚本执行。
 * 非浏览器环境（SSR/Node）无 document，调用即抛 ReferenceError。
 *
 * @param {string} url - js 链接地址；非字符串或空串抛 TypeError
 * @param {Function} [onSuccess] - 加载成功回调
 * @param {Function} [onError] - 加载失败回调（老 IE 分支不生效）
 * @example
 *
 * loadScript('https://xxx.js', () => {
 *  console.log('loaded');
 * });
 *
 * // 加载完才有全局可用，初始化放回调里
 * loadScript('https://cdn.example.com/echarts.min.js', () => {
 *  echarts.init(document.getElementById('chart'));
 * });
 *
 * // 主源失败自动回退备用源
 * loadScript('https://primary.cdn.com/lib.js', null, () => {
 *  loadScript('https://backup.cdn.com/lib.js');
 * });
 *
 * // 有依赖的脚本链式加载
 * loadScript('https://cdn.example.com/jquery.min.js', () => {
 *  loadScript('https://cdn.example.com/plugin.js');
 * });
 */
function loadScript(url, onSuccess, onError) {
  // 空 src 会被浏览器按当前页地址解析、null 会被拼成 'null'，都是加载到错误目标
  if (typeof url !== 'string' || url === '') {
    throw new TypeError('loadScript 的 url 必须是非空字符串');
  }
  assertOptionalCallback('onSuccess', onSuccess);
  assertOptionalCallback('onError', onError);
  const script = document.createElement('script');
  script.src = url;
  // 不换成 document.head：它 IE9 才有，下面的 readyState 分支恰是为更老的 IE 保留的
  document.getElementsByTagName('head')[0].appendChild(script);
  if (script.readyState) {
    // IE：老版本 script 不触发 onload/onerror，只能读 readyState；出错时它停在 'loaded' 不再前进，
    // 故 loaded|complete 一律当成功，区分不了失败（见头注释）
    script.onreadystatechange = () => {
      if (/loaded|complete/.test(script.readyState)) {
        script.onreadystatechange = null;
        if (onSuccess) onSuccess();
      }
    };
  } else {
    script.onload = () => {
      script.onload = null;
      if (onSuccess) onSuccess();
    };
    // 404/网络错误时 onload 永不触发，不挂 onerror 调用方只能无限等待
    script.onerror = () => {
      script.onerror = null;
      if (onError) onError();
      // 失败节点毫无用途，移出以免重试/CDN 回退时在 head 里累积垃圾；
      // 成功的不移——IE 可能在刚下载完还没执行时（'loaded'）就触发回调，此时摘节点会掐断还没执行的脚本
      script.remove();
    };
  }
}

export default {
  generateUUID,
  getParameter,
  loadScript,
};
