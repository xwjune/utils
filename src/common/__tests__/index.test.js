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
    expect(common.addEvent(target, 'click', handler)).toBe(true);
    expect(target.addEventListener).toHaveBeenCalledWith('click', handler, false);
    common.addEvent(target, 'click', handler, true);
    expect(target.addEventListener).toHaveBeenLastCalledWith('click', handler, true);
    expect(common.removeEvent(target, 'click', handler)).toBe(true);
    expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, false);
  });
  test('addEvent/removeEvent IE attachEvent 分支', () => {
    const target = { attachEvent: jest.fn(), detachEvent: jest.fn() };
    expect(common.addEvent(target, 'click', handler)).toBe(true);
    expect(target.attachEvent).toHaveBeenCalledWith('onclick', handler);
    common.removeEvent(target, 'click', handler);
    expect(target.detachEvent).toHaveBeenCalledWith('onclick', handler);
  });
  test('addEvent/removeEvent DOM0 onxxx 分支', () => {
    const target = {};
    expect(common.addEvent(target, 'click', handler)).toBe(true);
    expect(target.onclick).toBe(handler);
    common.removeEvent(target, 'click', handler);
    expect(target.onclick).toBeNull();
  });
  test('addEventListener 属性存在但非函数时回退 DOM0 不抛错', () => {
    const target = { addEventListener: 'oops' };
    expect(common.addEvent(target, 'click', handler)).toBe(true);
    expect(target.onclick).toBe(handler);
  });
  test('addEvent/removeEvent 事件名首尾空白自动截去', () => {
    const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    common.addEvent(target, ' click ', handler);
    expect(target.addEventListener).toHaveBeenCalledWith('click', handler, false);
    common.removeEvent(target, 'click ', handler);
    expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, false);
  });
  test('addEvent/removeEvent 空参与非法入参不抛错返回 false', () => {
    const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    // target 为空或原始类型：原始类型上挂属性会抛 TypeError，直接拦
    expect(common.addEvent(null, 'click', handler)).toBe(false);
    expect(common.removeEvent(123, 'click', handler)).toBe(false);
    // type 非字符串或纯空白：现代浏览器会隐式转成永不触发的事件名，直接拦
    expect(common.addEvent(target, 123, handler)).toBe(false);
    expect(common.addEvent(target, '  ', handler)).toBe(false);
    expect(common.removeEvent(target, ['click'], handler)).toBe(false);
    // handler 非函数：null/undefined 原生为静默 no-op，字符串等形式抛 TypeError，统一拦
    expect(common.addEvent(target, 'click')).toBe(false);
    expect(common.removeEvent(target, 'click', null)).toBe(false);
    expect(target.addEventListener).not.toHaveBeenCalled();
    expect(target.removeEventListener).not.toHaveBeenCalled();
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
  test('getStyle defaultView 无 getComputedStyle 时回退内联 style', () => {
    Object.defineProperty(document, 'defaultView', { get: () => ({}), configurable: true });
    expect(common.getStyle({ style: { color: 'blue' } }, 'color')).toBe('blue');
    // style 未命中与元素无 style 属性时返回空串
    expect(common.getStyle({ style: {} }, 'color')).toBe('');
    expect(common.getStyle({}, 'color')).toBe('');
    delete document.defaultView;
  });
  test('getStyle SSR 无 document 时回退内联 style', () => {
    const doc = global.document;
    delete global.document;
    try {
      // 连字符入参同样走驼峰转换
      expect(common.getStyle({ style: { fontSize: '16px' } }, 'font-size')).toBe('16px');
      expect(common.getStyle({}, 'color')).toBe('');
    } finally {
      global.document = doc;
    }
  });
  test('getStyle currentStyle 分支驼峰与连字符等价', () => {
    const el = { currentStyle: { fontSize: '14px' } };
    expect(common.getStyle(el, 'fontSize')).toBe('14px');
    expect(common.getStyle(el, 'font-size')).toBe('14px');
  });
  test('getStyle getComputedStyle 分支驼峰入参转连字符', () => {
    const el = document.createElement('div');
    el.style.fontSize = '12px';
    document.body.appendChild(el);
    expect(common.getStyle(el, 'fontSize')).toBe('12px');
    expect(common.getStyle(el, 'font-size')).toBe('12px');
    document.body.removeChild(el);
  });
  test('getStyle currentStyle 分支相对值（em/%）原样返回，不做解析', () => {
    // 对齐 JSDoc：IE currentStyle 返回未经计算的相对值，如 50%、1em、auto
    const el = { currentStyle: { fontSize: '1em', width: '50%' } };
    expect(common.getStyle(el, 'fontSize')).toBe('1em');
    expect(common.getStyle(el, 'width')).toBe('50%');
  });
  test('getStyle currentStyle 未命中返回空串', () => {
    expect(common.getStyle({ currentStyle: {} }, 'color')).toBe('');
  });
  test('getStyle getComputedStyle 分支 em 值经归一化链路不被破坏', () => {
    // jsdom 无布局引擎不解析相对值，此处原样返回 '2em'；真实浏览器该断言值为解析后的 px 计算值
    const el = document.createElement('div');
    el.style.fontSize = '2em';
    document.body.appendChild(el);
    expect(common.getStyle(el, 'fontSize')).toBe('2em');
    expect(common.getStyle(el, 'font-size')).toBe('2em');
    document.body.removeChild(el);
  });
  test('getStyle 空元素、空或非字符串样式名返回空串', () => {
    expect(common.getStyle(null, 'color')).toBe('');
    expect(common.getStyle(document.createElement('div'), '')).toBe('');
    expect(common.getStyle(document.createElement('div'), 123)).toBe('');
    expect(common.getStyle(document.createElement('div'), ['color'])).toBe('');
  });
});

describe('选中文本', () => {
  test('selectText 走 setSelectionRange，默认选中全部', () => {
    const input = document.createElement('input');
    input.value = '123456';
    expect(common.selectText(input)).toBe(true);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);
    common.selectText(input, 2, 0);
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
  });
  test('selectText 缺省 length 从 start 选中至末尾，参数规范化', () => {
    const input = document.createElement('input');
    input.value = '123456';
    common.selectText(input, 2);
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(6);
    // 字符串拼接回归：1 + '0' 不能变成 '10'
    common.selectText(input, 1, '0');
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
    // 非数字与负数兜底为 0
    common.selectText(input, 'abc');
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);
    common.selectText(input, -1, 2);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(2);
    common.selectText(input, 0, -3);
    expect(input.selectionEnd).toBe(0);
  });
  test('selectText 空参与非 input/textarea 元素返回 false，不触发 focus', () => {
    expect(common.selectText(null)).toBe(false);
    const div = { tagName: 'DIV', focus: jest.fn() };
    expect(common.selectText(div)).toBe(false);
    expect(div.focus).not.toHaveBeenCalled();
  });
  test('selectText disabled 返回 false', () => {
    const input = document.createElement('input');
    input.value = '123';
    input.disabled = true;
    expect(common.selectText(input)).toBe(false);
  });
  test('selectText start 超出末尾时缺省长度兜底为 0', () => {
    const input = {
      tagName: 'INPUT',
      value: '123',
      focus: jest.fn(),
      setSelectionRange: jest.fn(),
    };
    common.selectText(input, 10);
    expect(input.setSelectionRange).toHaveBeenCalledWith(10, 10);
  });
  test('selectText IE createTextRange 分支', () => {
    const range = {
      collapse: jest.fn(),
      moveStart: jest.fn(),
      moveEnd: jest.fn(),
      select: jest.fn(),
    };
    const input = { tagName: 'INPUT', createTextRange: jest.fn(() => range), focus: jest.fn() };
    expect(common.selectText(input, 2, 3)).toBe(true);
    expect(range.collapse).toHaveBeenCalledWith(true);
    expect(range.moveStart).toHaveBeenCalledWith('character', 2);
    expect(range.moveEnd).toHaveBeenCalledWith('character', 3);
    expect(range.select).toHaveBeenCalled();
    expect(input.focus).toHaveBeenCalled();
  });
  test('selectText 无 setSelectionRange/createTextRange 时只 focus', () => {
    // 显式传 start/length，绕过缺省 length 分支对 input.value 的访问
    const input = { tagName: 'INPUT', focus: jest.fn() };
    expect(common.selectText(input, 0, 0)).toBe(true);
    expect(input.focus).toHaveBeenCalled();
  });
});

describe('文档操作', () => {
  // jsdom 各视口属性默认 0/768，用 defineProperty 造值覆盖「取到值」与「回退」两条分支
  // 备份描述符恢复而非 delete——jsdom 的 pageYOffset/innerHeight 等是自有 getter，delete 会把 getter 弄丢
  const withProp = (obj, prop, value, fn) => {
    const desc = Object.getOwnPropertyDescriptor(obj, prop);
    Object.defineProperty(obj, prop, { value, configurable: true });
    try {
      fn();
    } finally {
      if (desc) {
        Object.defineProperty(obj, prop, desc);
      } else {
        delete obj[prop];
      }
    }
  };
  test('getWinHeight 优先 innerHeight，回退 documentElement/body', () => {
    withProp(window, 'innerHeight', 400, () => {
      expect(common.getWinHeight()).toBe(400);
    });
    // innerHeight 显式取 0 才是回退分支；jsdom 的 innerHeight getter 恢复后默认 768
    withProp(window, 'innerHeight', 0, () => {
      expect(common.getWinHeight()).toBe(0);
    });
  });
  test('getWinWidth 优先 innerWidth，回退 documentElement/body', () => {
    withProp(window, 'innerWidth', 800, () => {
      expect(common.getWinWidth()).toBe(800);
    });
    withProp(window, 'innerWidth', 0, () => {
      expect(common.getWinWidth()).toBe(0);
    });
  });
  test('getWinScrollHeight 优先 documentElement，body 仅在取值为 0 时兜底', () => {
    withProp(document.documentElement, 'scrollHeight', 100, () => {
      withProp(document.body, 'scrollHeight', 300, () => {
        expect(common.getWinScrollHeight()).toBe(100); // documentElement 有值即取，不与 body 比大小
      });
    });
    withProp(document.body, 'scrollHeight', 300, () => {
      expect(common.getWinScrollHeight()).toBe(300); // documentElement 取值为 0（老引擎）时兜底 body
    });
  });
  test('getWinScrollWidth 优先 documentElement，body 仅在取值为 0 时兜底', () => {
    withProp(document.documentElement, 'scrollWidth', 200, () => {
      withProp(document.body, 'scrollWidth', 500, () => {
        expect(common.getWinScrollWidth()).toBe(200);
      });
    });
    withProp(document.body, 'scrollWidth', 500, () => {
      expect(common.getWinScrollWidth()).toBe(500);
    });
  });
  test('getWinScrollTop 优先 pageYOffset，缺失时回退 scrollTop 链', () => {
    withProp(window, 'pageYOffset', 42, () => {
      expect(common.getWinScrollTop()).toBe(42);
      withProp(document.documentElement, 'scrollTop', 7, () => {
        expect(common.getWinScrollTop()).toBe(42); // pageYOffset 优先级更高
      });
    });
    withProp(window, 'pageYOffset', undefined, () => {
      withProp(document.documentElement, 'scrollTop', 33, () => {
        expect(common.getWinScrollTop()).toBe(33);
      });
      // 怪异模式：documentElement 恒 0，滚动值挂 body，选择链须取 body 侧
      withProp(document.body, 'scrollTop', 55, () => {
        expect(common.getWinScrollTop()).toBe(55);
      });
    });
  });
  test('getWinScrollLeft 优先 pageXOffset，缺失时回退 scrollLeft 链', () => {
    withProp(window, 'pageXOffset', 24, () => {
      expect(common.getWinScrollLeft()).toBe(24);
    });
    withProp(window, 'pageXOffset', undefined, () => {
      withProp(document.documentElement, 'scrollLeft', 15, () => {
        expect(common.getWinScrollLeft()).toBe(15);
      });
      // 怪异模式：documentElement 恒 0，滚动值挂 body，选择链须取 body 侧
      withProp(document.body, 'scrollLeft', 35, () => {
        expect(common.getWinScrollLeft()).toBe(35);
      });
    });
  });
  test('getElementOffset 叠加页面滚动偏移', () => {
    const el = { getBoundingClientRect: () => ({ top: 10, left: 20 }) };
    withProp(window, 'pageYOffset', 100, () => {
      withProp(window, 'pageXOffset', 50, () => {
        expect(common.getElementOffset(el)).toEqual({ top: 110, left: 70 });
      });
    });
  });
  test('getElementOffset 空值/非元素入参返回原点', () => {
    expect(common.getElementOffset(null)).toEqual({ top: 0, left: 0 });
    expect(common.getElementOffset(undefined)).toEqual({ top: 0, left: 0 });
    expect(common.getElementOffset('div')).toEqual({ top: 0, left: 0 });
  });
  test('document.body 为 null（脚本先于 body 解析）时的行为', () => {
    withProp(document, 'body', null, () => {
      // 真实浏览器 head 期 innerHeight/innerWidth 已有窗口尺寸，视口尺寸正常返回
      withProp(window, 'innerHeight', 768, () => {
        withProp(window, 'innerWidth', 1024, () => {
          expect(common.getWinHeight()).toBe(768);
          expect(common.getWinWidth()).toBe(1024);
        });
      });
      // 滚动偏移走 pageYOffset 分支，不受 body 影响
      expect(common.getWinScrollTop()).toBe(0);
      expect(common.getWinScrollLeft()).toBe(0);
      // scroll 系列此时在 null 上取属性抛错——fail-fast 暴露错误时机的调用，不返回 0 掩盖
      expect(() => common.getWinScrollHeight()).toThrow(TypeError);
      expect(() => common.getWinScrollWidth()).toThrow(TypeError);
    });
  });
});
