import vm from 'vm';
import cookie from '../index';

describe('cookie操作', () => {
  test('setCookie/getCookie 基本读写', () => {
    cookie.setCookie('jun-utils-test', 'value1');
    expect(cookie.getCookie('jun-utils-test')).toBe('value1');
    cookie.delCookie('jun-utils-test');
    expect(cookie.getCookie('jun-utils-test')).toBeNull();
  });
  test('options 显式传 null 兜底为空配置', () => {
    cookie.setCookie('jun-utils-null', 'value2', null);
    expect(cookie.getCookie('jun-utils-null')).toBe('value2');
    cookie.delCookie('jun-utils-null');
  });
  test('getCookie 未命中返回 null', () => {
    expect(cookie.getCookie('jun-utils-absent')).toBeNull();
  });
  test('getCookie 名称含正则元字符时不误匹配', () => {
    cookie.setCookie('jun-utils-xa', 'wrong');
    cookie.setCookie('jun-utils-.a', 'right');
    expect(cookie.getCookie('jun-utils-.a')).toBe('right');
    cookie.delCookie('jun-utils-xa');
    cookie.delCookie('jun-utils-.a');
  });
  test('getCookie 读未编码的值原样返回', () => {
    document.cookie = 'jun-utils-raw=50%off';
    expect(cookie.getCookie('jun-utils-raw')).toBe('50%off');
    cookie.delCookie('jun-utils-raw');
  });
  test('setCookie value 为 null/undefined 时跳过写入', () => {
    cookie.setCookie('jun-utils-empty');
    cookie.setCookie('jun-utils-empty2', null);
    expect(cookie.getCookie('jun-utils-empty')).toBeNull();
    expect(cookie.getCookie('jun-utils-empty2')).toBeNull();
  });
  test('setCookie 不污染传入的 options 对象', () => {
    const options = { maxAge: 60 * 60 * 24 };
    cookie.setCookie('jun-utils-pollute', 'value', options);
    expect(options).toEqual({ maxAge: 60 * 60 * 24 });
    cookie.delCookie('jun-utils-pollute');
  });
  test('setCookie maxAge: 0 立即失效', () => {
    cookie.setCookie('jun-utils-expire', 'value', { maxAge: 0 });
    expect(cookie.getCookie('jun-utils-expire')).toBeNull();
  });
  test('delCookie 删除指定 path 写入的 cookie', () => {
    cookie.setCookie('jun-utils-path', 'value', { path: '/' });
    expect(cookie.getCookie('jun-utils-path')).toBe('value');
    cookie.delCookie('jun-utils-path', { path: '/' });
    expect(cookie.getCookie('jun-utils-path')).toBeNull();
  });
  test('setCookie name 含非法字符时跳过写入', () => {
    const before = document.cookie;
    cookie.setCookie('jun-utils-bad;', 'value');
    cookie.setCookie('jun utils-bad', 'value');
    // 空白在 name 任何位置都非法（RFC 6265 cookie-name 是 token），前导/尾随/制表符一并拦
    cookie.setCookie(' jun-utils-bad', 'value');
    cookie.setCookie('jun-utils-bad ', 'value');
    cookie.setCookie('jun-utils\tbad', 'value');
    cookie.setCookie('jun=utils-bad', 'value');
    cookie.setCookie('jun-utils-ctl\x1fname', 'value');
    expect(document.cookie).toBe(before);
  });
  test('setCookie name 非字符串或空串时跳过写入（对齐 JSDoc 契约）', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    // ['a'] 隐式转成 'a' 能混过字符检查，123 同理，与调用本意不符，拒绝
    cookie.setCookie(['jun-utils-arrname'], 'v');
    cookie.setCookie(123, 'v');
    cookie.setCookie({ toString: () => 'jun-utils-objname' }, 'v');
    cookie.setCookie('', 'v');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  test('setCookie expires 非 Date 时忽略该配置', () => {
    cookie.setCookie('jun-utils-badexp', 'value', { expires: '2026-01-01' });
    expect(cookie.getCookie('jun-utils-badexp')).toBe('value');
    cookie.delCookie('jun-utils-badexp');
  });
  test('setCookie 默认写入 Path=/', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-defpath', 'value');
    expect(spy).toHaveBeenLastCalledWith('jun-utils-defpath=value; Path=/');
    spy.mockRestore();
  });
  test('sameSite=None 自动补 Secure，白名单外不写入', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-ss', 'v', { sameSite: 'None' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=None; Secure');
    cookie.setCookie('jun-utils-ss', 'v', { sameSite: 'none' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=None; Secure');
    cookie.setCookie('jun-utils-ss', 'v', { sameSite: 'lax' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=Lax');
    cookie.setCookie('jun-utils-ss', 'v', { sameSite: 'wrong' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/');
    cookie.setCookie('jun-utils-ss', 'v', { sameSite: { toString: () => 'lax' } });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=Lax');
    spy.mockRestore();
  });
  test('maxAge 转不成有限数值时忽略该配置', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-badmax', 'v', { maxAge: 'abc' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-badmax=v; Path=/');
    cookie.setCookie('jun-utils-strmax', 'v', { maxAge: '60' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-strmax=v; Path=/; Max-Age=60');
    spy.mockRestore();
  });
  test('maxAge 非 number/数字字符串时忽略该配置', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    // true/[]/'' 经 Number() 都能转出数值（[] 与 '' 转 0 会直接写没 cookie），忽略该属性而非猜
    cookie.setCookie('jun-utils-boolmax', 'v', { maxAge: true });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-boolmax=v; Path=/');
    cookie.setCookie('jun-utils-arrmax', 'v', { maxAge: [] });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-arrmax=v; Path=/');
    cookie.setCookie('jun-utils-emptymax', 'v', { maxAge: '' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-emptymax=v; Path=/');
    spy.mockRestore();
  });
  test('maxAge 为小数时向下取整', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-float', 'v', { maxAge: 1.5 });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-float=v; Path=/; Max-Age=1');
    spy.mockRestore();
  });
  test('setCookie value 仅接受 string/number/boolean，number 需为有限数值', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-obj', { a: 1 });
    cookie.setCookie('jun-utils-arr', ['a', 'b']);
    cookie.setCookie('jun-utils-nan', NaN);
    cookie.setCookie('jun-utils-inf', Infinity);
    expect(spy).not.toHaveBeenCalled();
    cookie.setCookie('jun-utils-num', 0);
    expect(spy).toHaveBeenLastCalledWith('jun-utils-num=0; Path=/');
    spy.mockRestore();
  });
  test('getCookie 空值 cookie 返回空串而非 null', () => {
    cookie.setCookie('jun-utils-emptyval', '');
    expect(cookie.getCookie('jun-utils-emptyval')).toBe('');
    cookie.delCookie('jun-utils-emptyval');
  });
  test('expires 为 Invalid Date 时忽略该配置', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-invalidd', 'v', { expires: new Date('invalid') });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-invalidd=v; Path=/');
    spy.mockRestore();
  });
  test('expires 为跨 realm Date（iframe 传入）时正常写入', () => {
    // instanceof 对其他 realm 的 Date 返回 false，改用 Object.prototype.toString 判别
    const crossRealm = vm.runInNewContext('new Date(Date.now() + 60000)');
    expect(crossRealm instanceof Date).toBe(false);
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-realm', 'v', { expires: crossRealm });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('; Expires='));
    spy.mockRestore();
  });
  test('domain/path 含非法字符时整单拒绝（与 delCookie 对称）', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-inject', 'v', { domain: 'a.com; Secure', path: '/app' });
    cookie.setCookie('jun-utils-inject', 'v', { path: '/; Secure' });
    cookie.setCookie('jun-utils-inject', 'v', { domain: 'a b' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  test('getCookie/delCookie 对非法 name 直接返回 null/不动作', () => {
    expect(cookie.getCookie('jun-utils-x;b')).toBeNull();
    expect(cookie.getCookie(['jun-utils-arrname'])).toBeNull();
    const before = document.cookie;
    cookie.delCookie('jun-utils-x;b');
    cookie.delCookie(['jun-utils-arrname']);
    expect(document.cookie).toBe(before);
  });
  test('delCookie 传入非法 path 时不误删根路径的同名 cookie', () => {
    cookie.setCookie('jun-utils-mis', 'v');
    cookie.delCookie('jun-utils-mis', { path: '/; Secure' });
    expect(cookie.getCookie('jun-utils-mis')).toBe('v');
    cookie.delCookie('jun-utils-mis');
  });
  test('path 不以 / 开头或 domain/path 非字符串时整单拒绝', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-relpath', 'v', { path: 'app' });
    cookie.setCookie('jun-utils-numpath', 'v', { path: 123 });
    cookie.setCookie('jun-utils-numdomain', 'v', { domain: 123 });
    // falsy 非字符串（0/false）同样是调用方 bug，不许静默降级成默认值
    cookie.setCookie('jun-utils-zeropath', 'v', { path: 0 });
    cookie.setCookie('jun-utils-falsedom', 'v', { domain: false });
    expect(spy).not.toHaveBeenCalled();
    cookie.delCookie('jun-utils-relpath', { path: 'app' });
    expect(spy).not.toHaveBeenCalled();
    // 空串视为未传，走默认 Path=/
    cookie.setCookie('jun-utils-emptypath', 'v', { path: '' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-emptypath=v; Path=/');
    spy.mockRestore();
  });
  test('delCookie 传入非法 domain 时拒绝删除', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.delCookie('jun-utils-x', { domain: 'a;b' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  test('delCookie 同时写 Max-Age=0 与过期 Expires', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.delCookie('jun-utils-dual');
    expect(spy).toHaveBeenLastCalledWith(
      'jun-utils-dual=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    spy.mockRestore();
  });
  test('setCookie/delCookie 写入 Domain', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.setCookie('jun-utils-dom', 'v', { domain: '.example.com' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-dom=v; Domain=.example.com; Path=/');
    cookie.delCookie('jun-utils-dom', { domain: '.example.com' });
    expect(spy).toHaveBeenLastCalledWith(
      'jun-utils-dom=; Domain=.example.com; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    spy.mockRestore();
  });
  test('delCookie 未传 path 时连当前页面目录一起删', () => {
    window.history.pushState({}, '', '/sub/page.html');
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    cookie.delCookie('jun-utils-dir');
    expect(spy).toHaveBeenNthCalledWith(
      1, 'jun-utils-dir=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2, 'jun-utils-dir=; Path=/sub; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    cookie.delCookie('jun-utils-dir', null);
    expect(spy).toHaveBeenCalledTimes(4);
    spy.mockRestore();
    window.history.pushState({}, '', '/');
  });
  test('SSR 无 window/document 时不抛 ReferenceError', () => {
    jest.resetModules();
    const doc = global.document;
    const win = global.window;
    delete global.document;
    delete global.window;
    try {
      // eslint-disable-next-line global-require
      const ssr = require('../index').default;
      expect(ssr.getCookie('a')).toBeNull();
      expect(() => ssr.setCookie('a', 'b')).not.toThrow();
      expect(() => ssr.delCookie('a')).not.toThrow();
    } finally {
      global.document = doc;
      global.window = win;
    }
  });
});
