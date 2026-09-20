import common from '../index';

describe('生成uuid', () => {
  const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  test('唯一性判断', () => {
    expect(common.generateUUID()).not.toBe(common.generateUUID());
  });
  test('输出 v4 格式（版本位 4、变体位 8/9/a/b）', () => {
    expect(common.generateUUID()).toMatch(V4);
  });
  test('环境有 crypto.randomUUID 时直接委托', () => {
    // 当前 jsdom 未暴露全局 crypto，手工注入以覆盖委托分支
    const stub = '11111111-2222-4333-8444-555555555555';
    global.crypto = { randomUUID: () => stub };
    try {
      expect(common.generateUUID()).toBe(stub);
    } finally {
      delete global.crypto;
    }
  });
  test('无 randomUUID 但有 getRandomValues 时走次选，仍为 v4', () => {
    // 注入固定随机源全填 0xff：除钉死的版本位 4 与变体位 b 外其余位原样透传
    global.crypto = { getRandomValues: (arr) => arr.fill(0xff) };
    try {
      expect(common.generateUUID()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
    } finally {
      delete global.crypto;
    }
  });
  test('crypto 存在但没有 getRandomValues 时退回 Math.random', () => {
    // 空壳 crypto（无 randomUUID 也无 getRandomValues）不能挡住兜底路径
    global.crypto = {};
    try {
      expect(common.generateUUID()).toMatch(V4);
    } finally {
      delete global.crypto;
    }
  });
  test('无 crypto.randomUUID 时退回 Math.random 生成，格式仍为 v4', () => {
    expect(common.generateUUID()).toMatch(V4);
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
  test('参数名含正则元字符时按字面匹配', () => {
    // a.b 中的 . 不通配到 axb，arr[] 不再被解析成空字符类而静默丢失
    expect(common.getParameter('a.b', 'http://www.w3school.com?axb=1')).toBeNull();
    expect(common.getParameter('a.b', 'http://www.w3school.com?a.b=1')).toBe('1');
    expect(common.getParameter('arr[]', 'http://www.w3school.com?arr[]=1')).toBe('1');
  });
  test('值含非法 % 序列时不抛 URIError，原样返回', () => {
    expect(common.getParameter('name', 'http://www.w3school.com?name=50%off')).toBe('50%off');
  });
  test('值里的合法编码会被解码', () => {
    expect(common.getParameter('name', 'http://www.w3school.com?name=a%20b')).toBe('a b');
  });
  test("'+' 不转空格，区别于 URLSearchParams 语义", () => {
    expect(common.getParameter('q', 'http://www.w3school.com?q=a+b')).toBe('a+b');
  });
  test('同名参数取先出现的', () => {
    expect(common.getParameter('name', 'http://www.w3school.com?name=a&name=b')).toBe('a');
  });
  test('参数名区分大小写', () => {
    expect(common.getParameter('name', 'http://www.w3school.com?Name=x')).toBeNull();
    expect(common.getParameter('Name', 'http://www.w3school.com?Name=x')).toBe('x');
  });
  test('无等号的裸参数视为不存在', () => {
    expect(common.getParameter('flag', 'http://www.w3school.com?flag')).toBeNull();
    expect(common.getParameter('flag', 'http://www.w3school.com?flag&name=x')).toBeNull();
  });
  test('参数名不解码：编码名需传编码形式', () => {
    expect(common.getParameter('arr%5B%5D', 'http://www.w3school.com?arr%5B%5D=1')).toBe('1');
    expect(common.getParameter('arr[]', 'http://www.w3school.com?arr%5B%5D=1')).toBeNull();
  });
  test('name 非字符串抛 TypeError', () => {
    expect(() => common.getParameter(123, '?123=1')).toThrow(TypeError);
    expect(() => common.getParameter(['a'], '?a=1')).toThrow(TypeError);
  });
  test('name 为空或含 & = # 抛 TypeError', () => {
    // 'a=b' 若放行，会从 '?a=b=1'（实为参数 a 值 'b=1'）里扫出 '1'
    expect(() => common.getParameter('', '?a=1')).toThrow(TypeError);
    expect(() => common.getParameter('a=b', '?a=b=1')).toThrow(TypeError);
    expect(() => common.getParameter('a&b', '?a=1')).toThrow(TypeError);
    expect(() => common.getParameter('a#b', '?a=1')).toThrow(TypeError);
  });
  test('url 显式传入非字符串抛 TypeError', () => {
    expect(() => common.getParameter('a', 123)).toThrow(TypeError);
    expect(() => common.getParameter('a', null)).toThrow(TypeError);
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
    script.onload();
    expect(cb).toHaveBeenCalledTimes(1);
    // 回调触发后 onload 置空，避免重复触发
    expect(script.onload).toBeNull();
    // 成功节点按契约保留在 DOM
    expect(document.querySelector('script[src="https://example.com/modern.js"]')).not.toBeNull();
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
  test('url 非字符串或空串抛 TypeError', () => {
    expect(() => common.loadScript(123)).toThrow(TypeError);
    expect(() => common.loadScript('')).toThrow(TypeError);
  });
  test('callback/onError 非函数抛 TypeError，null 视为不传', () => {
    expect(() => common.loadScript('https://example.com/badcb.js', 'str')).toThrow(TypeError);
    expect(() => common.loadScript('https://example.com/baderr.js', null, 42)).toThrow(TypeError);
    // null 占位不算错，正常走挂载
    common.loadScript('https://example.com/nullcb.js', null);
    const script = document.querySelector('script[src="https://example.com/nullcb.js"]');
    expect(() => script.onload()).not.toThrow();
    script.onload = null;
  });
  test('加载失败触发 onError 且只触发一次，成功回调不触发', () => {
    const cb = jest.fn();
    const errCb = jest.fn();
    common.loadScript('https://example.com/404.js', cb, errCb);
    const script = document.querySelector('script[src="https://example.com/404.js"]');
    script.onerror();
    expect(errCb).toHaveBeenCalledTimes(1);
    expect(cb).not.toHaveBeenCalled();
    // 触发后 onerror 置空，避免重复触发
    expect(script.onerror).toBeNull();
    // 失败节点按契约移出 DOM
    expect(document.querySelector('script[src="https://example.com/404.js"]')).toBeNull();
  });
});
