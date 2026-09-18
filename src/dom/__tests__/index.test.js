import dom from '../index';

describe('获取元素样式', () => {
  test('getStyle 优先 currentStyle（老 IE）', () => {
    const el = { currentStyle: { color: 'red' } };
    expect(dom.getStyle(el, 'color')).toBe('red');
  });
  test('getStyle 走 getComputedStyle', () => {
    const el = document.createElement('div');
    el.style.width = '10px';
    document.body.appendChild(el);
    expect(dom.getStyle(el, 'width')).toBe('10px');
    document.body.removeChild(el);
  });
  test('getStyle 无 defaultView 时回退内联 style', () => {
    Object.defineProperty(document, 'defaultView', { get: () => null, configurable: true });
    expect(dom.getStyle({ style: { color: 'blue' } }, 'color')).toBe('blue');
    delete document.defaultView;
  });
  test('getStyle defaultView 无 getComputedStyle 时回退内联 style', () => {
    Object.defineProperty(document, 'defaultView', { get: () => ({}), configurable: true });
    expect(dom.getStyle({ style: { color: 'blue' } }, 'color')).toBe('blue');
    // style 未命中与元素无 style 属性时返回空串
    expect(dom.getStyle({ style: {} }, 'color')).toBe('');
    expect(dom.getStyle({}, 'color')).toBe('');
    delete document.defaultView;
  });
  test('getStyle SSR 无 document 时回退内联 style', () => {
    const doc = global.document;
    delete global.document;
    try {
      // 连字符入参同样走驼峰转换
      expect(dom.getStyle({ style: { fontSize: '16px' } }, 'font-size')).toBe('16px');
      expect(dom.getStyle({}, 'color')).toBe('');
    } finally {
      global.document = doc;
    }
  });
  test('getStyle currentStyle 分支驼峰与连字符等价', () => {
    const el = { currentStyle: { fontSize: '14px' } };
    expect(dom.getStyle(el, 'fontSize')).toBe('14px');
    expect(dom.getStyle(el, 'font-size')).toBe('14px');
  });
  test('getStyle getComputedStyle 分支驼峰入参转连字符', () => {
    const el = document.createElement('div');
    el.style.fontSize = '12px';
    document.body.appendChild(el);
    expect(dom.getStyle(el, 'fontSize')).toBe('12px');
    expect(dom.getStyle(el, 'font-size')).toBe('12px');
    document.body.removeChild(el);
  });
  test('getStyle currentStyle 分支相对值（em/%）原样返回，不做解析', () => {
    // 对齐 JSDoc：IE currentStyle 返回未经计算的相对值，如 50%、1em、auto
    const el = { currentStyle: { fontSize: '1em', width: '50%' } };
    expect(dom.getStyle(el, 'fontSize')).toBe('1em');
    expect(dom.getStyle(el, 'width')).toBe('50%');
  });
  test('getStyle currentStyle 未命中返回空串', () => {
    expect(dom.getStyle({ currentStyle: {} }, 'color')).toBe('');
  });
  test('getStyle getComputedStyle 分支 em 值经归一化链路不被破坏', () => {
    // jsdom 无布局引擎不解析相对值，此处原样返回 '2em'；真实浏览器该断言值为解析后的 px 计算值
    const el = document.createElement('div');
    el.style.fontSize = '2em';
    document.body.appendChild(el);
    expect(dom.getStyle(el, 'fontSize')).toBe('2em');
    expect(dom.getStyle(el, 'font-size')).toBe('2em');
    document.body.removeChild(el);
  });
  test('getStyle 空元素、空或非字符串样式名返回空串', () => {
    expect(dom.getStyle(null, 'color')).toBe('');
    expect(dom.getStyle(document.createElement('div'), '')).toBe('');
    expect(dom.getStyle(document.createElement('div'), 123)).toBe('');
    expect(dom.getStyle(document.createElement('div'), ['color'])).toBe('');
  });
});

describe('选中文本', () => {
  test('selectText 走 setSelectionRange，默认选中全部', () => {
    const input = document.createElement('input');
    input.value = '123456';
    expect(dom.selectText(input)).toBe(true);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);
    dom.selectText(input, 2, 0);
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
  });
  test('selectText 缺省 length 从 start 选中至末尾，参数规范化', () => {
    const input = document.createElement('input');
    input.value = '123456';
    dom.selectText(input, 2);
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(6);
    // 字符串拼接回归：1 + '0' 不能变成 '10'
    dom.selectText(input, 1, '0');
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
    // 非数字与负数兜底为 0
    dom.selectText(input, 'abc');
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);
    dom.selectText(input, -1, 2);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(2);
    dom.selectText(input, 0, -3);
    expect(input.selectionEnd).toBe(0);
  });
  test('selectText 空参与非 input/textarea 元素返回 false，不触发 focus', () => {
    expect(dom.selectText(null)).toBe(false);
    const div = { tagName: 'DIV', focus: jest.fn() };
    expect(dom.selectText(div)).toBe(false);
    expect(div.focus).not.toHaveBeenCalled();
  });
  test('selectText disabled 返回 false', () => {
    const input = document.createElement('input');
    input.value = '123';
    input.disabled = true;
    expect(dom.selectText(input)).toBe(false);
  });
  test('selectText start 超出末尾时缺省长度兜底为 0', () => {
    const input = {
      tagName: 'INPUT',
      value: '123',
      focus: jest.fn(),
      setSelectionRange: jest.fn(),
    };
    dom.selectText(input, 10);
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
    expect(dom.selectText(input, 2, 3)).toBe(true);
    expect(range.collapse).toHaveBeenCalledWith(true);
    expect(range.moveStart).toHaveBeenCalledWith('character', 2);
    expect(range.moveEnd).toHaveBeenCalledWith('character', 3);
    expect(range.select).toHaveBeenCalled();
    expect(input.focus).toHaveBeenCalled();
  });
  test('selectText 无 setSelectionRange/createTextRange 时只 focus', () => {
    // 显式传 start/length，绕过缺省 length 分支对 input.value 的访问
    const input = { tagName: 'INPUT', focus: jest.fn() };
    expect(dom.selectText(input, 0, 0)).toBe(true);
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
      expect(dom.getWinHeight()).toBe(400);
    });
    // innerHeight 显式取 0 才是回退分支；jsdom 的 innerHeight getter 恢复后默认 768
    withProp(window, 'innerHeight', 0, () => {
      expect(dom.getWinHeight()).toBe(0);
    });
  });
  test('getWinWidth 优先 innerWidth，回退 documentElement/body', () => {
    withProp(window, 'innerWidth', 800, () => {
      expect(dom.getWinWidth()).toBe(800);
    });
    withProp(window, 'innerWidth', 0, () => {
      expect(dom.getWinWidth()).toBe(0);
    });
  });
  test('getWinScrollHeight 优先 documentElement，body 仅在取值为 0 时兜底', () => {
    withProp(document.documentElement, 'scrollHeight', 100, () => {
      withProp(document.body, 'scrollHeight', 300, () => {
        expect(dom.getWinScrollHeight()).toBe(100); // documentElement 有值即取，不与 body 比大小
      });
    });
    withProp(document.body, 'scrollHeight', 300, () => {
      expect(dom.getWinScrollHeight()).toBe(300); // documentElement 取值为 0（老引擎）时兜底 body
    });
  });
  test('getWinScrollWidth 优先 documentElement，body 仅在取值为 0 时兜底', () => {
    withProp(document.documentElement, 'scrollWidth', 200, () => {
      withProp(document.body, 'scrollWidth', 500, () => {
        expect(dom.getWinScrollWidth()).toBe(200);
      });
    });
    withProp(document.body, 'scrollWidth', 500, () => {
      expect(dom.getWinScrollWidth()).toBe(500);
    });
  });
  test('getWinScrollTop 优先 pageYOffset，缺失时回退 scrollTop 链', () => {
    withProp(window, 'pageYOffset', 42, () => {
      expect(dom.getWinScrollTop()).toBe(42);
      withProp(document.documentElement, 'scrollTop', 7, () => {
        expect(dom.getWinScrollTop()).toBe(42); // pageYOffset 优先级更高
      });
    });
    withProp(window, 'pageYOffset', undefined, () => {
      withProp(document.documentElement, 'scrollTop', 33, () => {
        expect(dom.getWinScrollTop()).toBe(33);
      });
      // 怪异模式：documentElement 恒 0，滚动值挂 body，选择链须取 body 侧
      withProp(document.body, 'scrollTop', 55, () => {
        expect(dom.getWinScrollTop()).toBe(55);
      });
    });
  });
  test('getWinScrollLeft 优先 pageXOffset，缺失时回退 scrollLeft 链', () => {
    withProp(window, 'pageXOffset', 24, () => {
      expect(dom.getWinScrollLeft()).toBe(24);
    });
    withProp(window, 'pageXOffset', undefined, () => {
      withProp(document.documentElement, 'scrollLeft', 15, () => {
        expect(dom.getWinScrollLeft()).toBe(15);
      });
      // 怪异模式：documentElement 恒 0，滚动值挂 body，选择链须取 body 侧
      withProp(document.body, 'scrollLeft', 35, () => {
        expect(dom.getWinScrollLeft()).toBe(35);
      });
    });
  });
  test('getElementOffset 叠加页面滚动偏移', () => {
    const el = { getBoundingClientRect: () => ({ top: 10, left: 20 }) };
    withProp(window, 'pageYOffset', 100, () => {
      withProp(window, 'pageXOffset', 50, () => {
        expect(dom.getElementOffset(el)).toEqual({ top: 110, left: 70 });
      });
    });
  });
  test('getElementOffset 空值/非元素入参返回原点', () => {
    expect(dom.getElementOffset(null)).toEqual({ top: 0, left: 0 });
    expect(dom.getElementOffset(undefined)).toEqual({ top: 0, left: 0 });
    expect(dom.getElementOffset('div')).toEqual({ top: 0, left: 0 });
  });
  test('document.body 为 null（脚本先于 body 解析）时的行为', () => {
    withProp(document, 'body', null, () => {
      // 真实浏览器 head 期 innerHeight/innerWidth 已有窗口尺寸，视口尺寸正常返回
      withProp(window, 'innerHeight', 768, () => {
        withProp(window, 'innerWidth', 1024, () => {
          expect(dom.getWinHeight()).toBe(768);
          expect(dom.getWinWidth()).toBe(1024);
        });
      });
      // 滚动偏移走 pageYOffset 分支，不受 body 影响
      expect(dom.getWinScrollTop()).toBe(0);
      expect(dom.getWinScrollLeft()).toBe(0);
      // scroll 系列此时在 null 上取属性抛错——fail-fast 暴露错误时机的调用，不返回 0 掩盖
      expect(() => dom.getWinScrollHeight()).toThrow(TypeError);
      expect(() => dom.getWinScrollWidth()).toThrow(TypeError);
    });
  });
});
