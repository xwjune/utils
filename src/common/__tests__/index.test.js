import vm from 'vm';
import common from '../index';

describe('生成uuid', () => {
  test('唯一性判断', () => {
    expect(common.generateUUID()).not.toBe(common.generateUUID());
  });
});

describe('cookie操作', () => {
  test('setCookie/getCookie 基本读写', () => {
    common.setCookie('jun-utils-test', 'value1');
    expect(common.getCookie('jun-utils-test')).toBe('value1');
    common.delCookie('jun-utils-test');
    expect(common.getCookie('jun-utils-test')).toBeNull();
  });
  test('options 显式传 null 兜底为空配置', () => {
    common.setCookie('jun-utils-null', 'value2', null);
    expect(common.getCookie('jun-utils-null')).toBe('value2');
    common.delCookie('jun-utils-null');
  });
  test('getCookie 未命中返回 null', () => {
    expect(common.getCookie('jun-utils-absent')).toBeNull();
  });
  test('getCookie 名称含正则元字符时不误匹配', () => {
    common.setCookie('jun-utils-xa', 'wrong');
    common.setCookie('jun-utils-.a', 'right');
    expect(common.getCookie('jun-utils-.a')).toBe('right');
    common.delCookie('jun-utils-xa');
    common.delCookie('jun-utils-.a');
  });
  test('getCookie 读未编码的值原样返回', () => {
    document.cookie = 'jun-utils-raw=50%off';
    expect(common.getCookie('jun-utils-raw')).toBe('50%off');
    common.delCookie('jun-utils-raw');
  });
  test('setCookie value 为 null/undefined 时跳过写入', () => {
    common.setCookie('jun-utils-empty');
    common.setCookie('jun-utils-empty2', null);
    expect(common.getCookie('jun-utils-empty')).toBeNull();
    expect(common.getCookie('jun-utils-empty2')).toBeNull();
  });
  test('setCookie 不污染传入的 options 对象', () => {
    const options = { maxAge: 60 * 60 * 24 };
    common.setCookie('jun-utils-pollute', 'value', options);
    expect(options).toEqual({ maxAge: 60 * 60 * 24 });
    common.delCookie('jun-utils-pollute');
  });
  test('setCookie maxAge: 0 立即失效', () => {
    common.setCookie('jun-utils-expire', 'value', { maxAge: 0 });
    expect(common.getCookie('jun-utils-expire')).toBeNull();
  });
  test('delCookie 删除指定 path 写入的 cookie', () => {
    common.setCookie('jun-utils-path', 'value', { path: '/' });
    expect(common.getCookie('jun-utils-path')).toBe('value');
    common.delCookie('jun-utils-path', { path: '/' });
    expect(common.getCookie('jun-utils-path')).toBeNull();
  });
  test('setCookie name 含非法字符时跳过写入', () => {
    const before = document.cookie;
    common.setCookie('jun-utils-bad;', 'value');
    common.setCookie('jun utils-bad', 'value');
    // 空白在 name 任何位置都非法（RFC 6265 cookie-name 是 token），前导/尾随/制表符一并拦
    common.setCookie(' jun-utils-bad', 'value');
    common.setCookie('jun-utils-bad ', 'value');
    common.setCookie('jun-utils\tbad', 'value');
    common.setCookie('jun=utils-bad', 'value');
    common.setCookie('jun-utils-ctl\x1fname', 'value');
    expect(document.cookie).toBe(before);
  });
  test('setCookie name 非字符串或空串时跳过写入（对齐 JSDoc 契约）', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    // ['a'] 隐式转成 'a' 能混过字符检查，123 同理，与调用本意不符，拒绝
    common.setCookie(['jun-utils-arrname'], 'v');
    common.setCookie(123, 'v');
    common.setCookie({ toString: () => 'jun-utils-objname' }, 'v');
    common.setCookie('', 'v');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  test('setCookie expires 非 Date 时忽略该配置', () => {
    common.setCookie('jun-utils-badexp', 'value', { expires: '2026-01-01' });
    expect(common.getCookie('jun-utils-badexp')).toBe('value');
    common.delCookie('jun-utils-badexp');
  });
  test('setCookie 默认写入 Path=/', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-defpath', 'value');
    expect(spy).toHaveBeenLastCalledWith('jun-utils-defpath=value; Path=/');
    spy.mockRestore();
  });
  test('sameSite=None 自动补 Secure，白名单外不写入', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-ss', 'v', { sameSite: 'None' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=None; Secure');
    common.setCookie('jun-utils-ss', 'v', { sameSite: 'none' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=None; Secure');
    common.setCookie('jun-utils-ss', 'v', { sameSite: 'lax' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=Lax');
    common.setCookie('jun-utils-ss', 'v', { sameSite: 'wrong' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/');
    common.setCookie('jun-utils-ss', 'v', { sameSite: { toString: () => 'lax' } });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-ss=v; Path=/; SameSite=Lax');
    spy.mockRestore();
  });
  test('maxAge 转不成有限数值时忽略该配置', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-badmax', 'v', { maxAge: 'abc' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-badmax=v; Path=/');
    common.setCookie('jun-utils-strmax', 'v', { maxAge: '60' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-strmax=v; Path=/; Max-Age=60');
    spy.mockRestore();
  });
  test('maxAge 非 number/数字字符串时忽略该配置', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    // true/[]/'' 经 Number() 都能转出数值（[] 与 '' 转 0 会直接写没 cookie），忽略该属性而非猜
    common.setCookie('jun-utils-boolmax', 'v', { maxAge: true });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-boolmax=v; Path=/');
    common.setCookie('jun-utils-arrmax', 'v', { maxAge: [] });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-arrmax=v; Path=/');
    common.setCookie('jun-utils-emptymax', 'v', { maxAge: '' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-emptymax=v; Path=/');
    spy.mockRestore();
  });
  test('maxAge 为小数时向下取整', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-float', 'v', { maxAge: 1.5 });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-float=v; Path=/; Max-Age=1');
    spy.mockRestore();
  });
  test('setCookie value 仅接受 string/number/boolean，number 需为有限数值', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-obj', { a: 1 });
    common.setCookie('jun-utils-arr', ['a', 'b']);
    common.setCookie('jun-utils-nan', NaN);
    common.setCookie('jun-utils-inf', Infinity);
    expect(spy).not.toHaveBeenCalled();
    common.setCookie('jun-utils-num', 0);
    expect(spy).toHaveBeenLastCalledWith('jun-utils-num=0; Path=/');
    spy.mockRestore();
  });
  test('getCookie 空值 cookie 返回空串而非 null', () => {
    common.setCookie('jun-utils-emptyval', '');
    expect(common.getCookie('jun-utils-emptyval')).toBe('');
    common.delCookie('jun-utils-emptyval');
  });
  test('expires 为 Invalid Date 时忽略该配置', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-invalidd', 'v', { expires: new Date('invalid') });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-invalidd=v; Path=/');
    spy.mockRestore();
  });
  test('expires 为跨 realm Date（iframe 传入）时正常写入', () => {
    // instanceof 对其他 realm 的 Date 返回 false，改用 Object.prototype.toString 判别
    const crossRealm = vm.runInNewContext('new Date(Date.now() + 60000)');
    expect(crossRealm instanceof Date).toBe(false);
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-realm', 'v', { expires: crossRealm });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('; Expires='));
    spy.mockRestore();
  });
  test('domain/path 含非法字符时整单拒绝（与 delCookie 对称）', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-inject', 'v', { domain: 'a.com; Secure', path: '/app' });
    common.setCookie('jun-utils-inject', 'v', { path: '/; Secure' });
    common.setCookie('jun-utils-inject', 'v', { domain: 'a b' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  test('getCookie/delCookie 对非法 name 直接返回 null/不动作', () => {
    expect(common.getCookie('jun-utils-x;b')).toBeNull();
    expect(common.getCookie(['jun-utils-arrname'])).toBeNull();
    const before = document.cookie;
    common.delCookie('jun-utils-x;b');
    common.delCookie(['jun-utils-arrname']);
    expect(document.cookie).toBe(before);
  });
  test('delCookie 传入非法 path 时不误删根路径的同名 cookie', () => {
    common.setCookie('jun-utils-mis', 'v');
    common.delCookie('jun-utils-mis', { path: '/; Secure' });
    expect(common.getCookie('jun-utils-mis')).toBe('v');
    common.delCookie('jun-utils-mis');
  });
  test('path 不以 / 开头或 domain/path 非字符串时整单拒绝', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-relpath', 'v', { path: 'app' });
    common.setCookie('jun-utils-numpath', 'v', { path: 123 });
    common.setCookie('jun-utils-numdomain', 'v', { domain: 123 });
    // falsy 非字符串（0/false）同样是调用方 bug，不许静默降级成默认值
    common.setCookie('jun-utils-zeropath', 'v', { path: 0 });
    common.setCookie('jun-utils-falsedom', 'v', { domain: false });
    expect(spy).not.toHaveBeenCalled();
    common.delCookie('jun-utils-relpath', { path: 'app' });
    expect(spy).not.toHaveBeenCalled();
    // 空串视为未传，走默认 Path=/
    common.setCookie('jun-utils-emptypath', 'v', { path: '' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-emptypath=v; Path=/');
    spy.mockRestore();
  });
  test('delCookie 传入非法 domain 时拒绝删除', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.delCookie('jun-utils-x', { domain: 'a;b' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  test('delCookie 同时写 Max-Age=0 与过期 Expires', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.delCookie('jun-utils-dual');
    expect(spy).toHaveBeenLastCalledWith(
      'jun-utils-dual=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    spy.mockRestore();
  });
  test('setCookie/delCookie 写入 Domain', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.setCookie('jun-utils-dom', 'v', { domain: '.example.com' });
    expect(spy).toHaveBeenLastCalledWith('jun-utils-dom=v; Domain=.example.com; Path=/');
    common.delCookie('jun-utils-dom', { domain: '.example.com' });
    expect(spy).toHaveBeenLastCalledWith(
      'jun-utils-dom=; Domain=.example.com; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    spy.mockRestore();
  });
  test('delCookie 未传 path 时连当前页面目录一起删', () => {
    window.history.pushState({}, '', '/sub/page.html');
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    common.delCookie('jun-utils-dir');
    expect(spy).toHaveBeenNthCalledWith(
      1, 'jun-utils-dir=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2, 'jun-utils-dir=; Path=/sub; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    common.delCookie('jun-utils-dir', null);
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

describe('获取url中的参数', () => {
  const t1 = 'http://www.w3school.com?name=';
  test(`提取name参数：${t1}`, () => {
    expect(common.getParameter('name', t1)).toBe('');
  });
  const t2 = 'http://www.w3school.com';
  test(`提取name参数：${t2}`, () => {
    expect(common.getParameter('name', t2)).toBeNull();
  });
  [
    'http://www.w3school.com?name=xxx',
    'http://www.w3school.com?name=xxx#/main',
    'http://www.w3school.com?age=12#/main?name=xxx',
  ].forEach((el) => {
    test(`提取name参数：${el}`, () => {
      expect(common.getParameter('name', el)).toBe('xxx');
    });
  });
  test('getParameter 不传 url 时取当前地址', () => {
    window.history.pushState({}, '', '/?name=fromSearch');
    expect(common.getParameter('name')).toBe('fromSearch');
    window.history.pushState({}, '', '/');
  });
});

describe('动态加载js', () => {
  test('loadScript 挂载 script 并在 onload 后触发回调且只触发一次', () => {
    const cb = jest.fn();
    common.loadScript('https://example.com/modern.js', cb);
    const script = document.querySelector('script[src="https://example.com/modern.js"]');
    expect(script).not.toBeNull();
    expect(script.getAttribute('type')).toBe('text/javascript');
    expect(script.getAttribute('charset')).toBe('utf-8');
    script.onload();
    expect(cb).toHaveBeenCalledTimes(1);
    // 回调触发后 onload 置空，避免重复触发
    expect(script.onload).toBeNull();
    script.onload = null;
  });
  test('loadScript 不传回调时 onload 不抛错', () => {
    common.loadScript('https://example.com/nocb.js');
    const script = document.querySelector('script[src="https://example.com/nocb.js"]');
    expect(() => script.onload()).not.toThrow();
    script.onload = null;
  });
  test('loadScript IE 走 onreadystatechange，loaded|complete 才触发', () => {
    const origCreate = document.createElement.bind(document);
    const spy = jest.spyOn(document, 'createElement').mockImplementation((...args) => {
      const el = origCreate(...args);
      if (el.tagName === 'SCRIPT') {
        Object.defineProperty(el, 'readyState', { value: 'loading', writable: true, configurable: true });
      }
      return el;
    });
    const cb = jest.fn();
    common.loadScript('https://example.com/ie.js', cb);
    const script = document.querySelector('script[src="https://example.com/ie.js"]');
    script.onreadystatechange();
    expect(cb).not.toHaveBeenCalled();
    script.readyState = 'complete';
    script.onreadystatechange();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(script.onreadystatechange).toBeNull();
    spy.mockRestore();
    script.onreadystatechange = null;
  });
  test('loadScript IE 分支不传回调时 onreadystatechange 不抛错', () => {
    const origCreate = document.createElement.bind(document);
    const spy = jest.spyOn(document, 'createElement').mockImplementation((...args) => {
      const el = origCreate(...args);
      if (el.tagName === 'SCRIPT') {
        Object.defineProperty(el, 'readyState', { value: 'complete', configurable: true });
      }
      return el;
    });
    common.loadScript('https://example.com/ienocb.js');
    const script = document.querySelector('script[src="https://example.com/ienocb.js"]');
    expect(() => script.onreadystatechange()).not.toThrow();
    spy.mockRestore();
    script.onreadystatechange = null;
  });
});

describe('阻止事件冒泡/默认行为', () => {
  test('stopPropagation 优先原生方法', () => {
    const evt = { stopPropagation: jest.fn() };
    common.stopPropagation(evt);
    expect(evt.stopPropagation).toHaveBeenCalled();
  });
  test('stopPropagation evt 为空时直接返回', () => {
    expect(() => common.stopPropagation()).not.toThrow();
  });
  test('stopPropagation IE 分支写 window.event.cancelBubble', () => {
    window.event = {};
    common.stopPropagation({});
    expect(window.event.cancelBubble).toBe(true);
    delete window.event;
  });
  test('preventDefault 优先原生方法', () => {
    const evt = { preventDefault: jest.fn() };
    common.preventDefault(evt);
    expect(evt.preventDefault).toHaveBeenCalled();
  });
  test('preventDefault evt 为空时直接返回', () => {
    expect(() => common.preventDefault()).not.toThrow();
  });
  test('preventDefault IE 分支写 window.event.returnValue', () => {
    window.event = {};
    common.preventDefault({});
    expect(window.event.returnValue).toBe(false);
    delete window.event;
  });
});

describe('事件监听', () => {
  const handler = () => {};
  test('addEvent/removeEvent DOM2 addEventListener 分支', () => {
    const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    common.addEvent(target, 'click', handler);
    expect(target.addEventListener).toHaveBeenCalledWith('click', handler, false);
    common.addEvent(target, 'click', handler, true);
    expect(target.addEventListener).toHaveBeenLastCalledWith('click', handler, true);
    common.removeEvent(target, 'click', handler);
    expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, false);
  });
  test('addEvent/removeEvent IE attachEvent 分支', () => {
    const target = { attachEvent: jest.fn(), detachEvent: jest.fn() };
    common.addEvent(target, 'click', handler);
    expect(target.attachEvent).toHaveBeenCalledWith('onclick', handler);
    common.removeEvent(target, 'click', handler);
    expect(target.detachEvent).toHaveBeenCalledWith('onclick', handler);
  });
  test('addEvent/removeEvent DOM0 onxxx 分支', () => {
    const target = {};
    common.addEvent(target, 'click', handler);
    expect(target.onclick).toBe(handler);
    common.removeEvent(target, 'click', handler);
    expect(target.onclick).toBeNull();
  });
});

describe('获取元素样式', () => {
  test('getStyle 优先 currentStyle（老 IE）', () => {
    const el = { currentStyle: { color: 'red' } };
    expect(common.getStyle(el, 'color')).toBe('red');
  });
  test('getStyle 走 getComputedStyle', () => {
    const el = document.createElement('div');
    el.style.width = '10px';
    document.body.appendChild(el);
    expect(common.getStyle(el, 'width')).toBe('10px');
    document.body.removeChild(el);
  });
  test('getStyle 无 defaultView 时回退内联 style', () => {
    Object.defineProperty(document, 'defaultView', { get: () => null, configurable: true });
    expect(common.getStyle({ style: { color: 'blue' } }, 'color')).toBe('blue');
    delete document.defaultView;
  });
});

describe('选中文本', () => {
  test('selectText 走 setSelectionRange，默认选中全部', () => {
    const input = document.createElement('input');
    input.value = '123456';
    common.selectText(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);
    common.selectText(input, 2, 0);
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
  });
  test('selectText IE createTextRange 分支', () => {
    const range = {
      collapse: jest.fn(),
      moveStart: jest.fn(),
      moveEnd: jest.fn(),
      select: jest.fn(),
    };
    const input = { createTextRange: jest.fn(() => range), focus: jest.fn() };
    common.selectText(input, 2, 3);
    expect(range.collapse).toHaveBeenCalledWith(true);
    expect(range.moveStart).toHaveBeenCalledWith('character', 2);
    expect(range.moveEnd).toHaveBeenCalledWith('character', 3);
    expect(range.select).toHaveBeenCalled();
    expect(input.focus).toHaveBeenCalled();
  });
  test('selectText 无 setSelectionRange/createTextRange 时只 focus', () => {
    // 显式传 start/length，绕过默认 length 分支对 textNode.value 的访问
    const input = { focus: jest.fn() };
    common.selectText(input, 0, 0);
    expect(input.focus).toHaveBeenCalled();
  });
});

describe('文档操作', () => {
  // jsdom 各视口属性默认 0/768，用 defineProperty 造值覆盖「取到值」与「回退」两条分支
  const withProp = (obj, prop, value, fn) => {
    Object.defineProperty(obj, prop, { value, configurable: true });
    try {
      fn();
    } finally {
      delete obj[prop];
    }
  };
  test('getWinHeight 优先 innerHeight，回退 documentElement/body', () => {
    withProp(window, 'innerHeight', 400, () => {
      expect(common.getWinHeight()).toBe(400);
    });
    expect(common.getWinHeight()).toBe(0);
  });
  test('getWinWidth 优先 innerWidth，回退 documentElement/body', () => {
    withProp(window, 'innerWidth', 800, () => {
      expect(common.getWinWidth()).toBe(800);
    });
    expect(common.getWinWidth()).toBe(0);
  });
  test('getWinScrollHeight 优先 documentElement，回退 body', () => {
    withProp(document.documentElement, 'scrollHeight', 100, () => {
      expect(common.getWinScrollHeight()).toBe(100);
    });
    expect(common.getWinScrollHeight()).toBe(0);
  });
  test('getWinScrollWidth 优先 documentElement，回退 body', () => {
    withProp(document.documentElement, 'scrollWidth', 200, () => {
      expect(common.getWinScrollWidth()).toBe(200);
    });
    expect(common.getWinScrollWidth()).toBe(0);
  });
  test('getWinScrollTop 优先 documentElement，回退 body', () => {
    withProp(document.documentElement, 'scrollTop', 42, () => {
      expect(common.getWinScrollTop()).toBe(42);
    });
    expect(common.getWinScrollTop()).toBe(0);
  });
  test('getWinScrollLeft 优先 documentElement，回退 body', () => {
    withProp(document.documentElement, 'scrollLeft', 24, () => {
      expect(common.getWinScrollLeft()).toBe(24);
    });
    expect(common.getWinScrollLeft()).toBe(0);
  });
  test('getElementOffset 叠加页面滚动偏移', () => {
    const el = { getBoundingClientRect: () => ({ top: 10, left: 20 }) };
    withProp(window, 'pageYOffset', 100, () => {
      withProp(window, 'pageXOffset', 50, () => {
        expect(common.getElementOffset(el)).toEqual({ top: 110, left: 70 });
      });
    });
  });
});
