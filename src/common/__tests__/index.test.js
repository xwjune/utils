import common from '../index';

describe('生成uuid', () => {
  test('唯一性判断', () => {
    expect(common.generateUUID()).not.toBe(common.generateUUID());
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
