import event from '../index';

describe('阻止事件冒泡/默认行为', () => {
  test('stopPropagation 优先原生方法', () => {
    const evt = { stopPropagation: jest.fn() };
    event.stopPropagation(evt);
    expect(evt.stopPropagation).toHaveBeenCalled();
  });
  test('stopPropagation evt 与 window.event 均缺失时抛 TypeError', () => {
    delete window.event;
    expect(() => event.stopPropagation()).toThrow(TypeError);
  });
  test('stopPropagation 无参调用回退 window.event 置 cancelBubble（IE8- attachEvent 回调无参）', () => {
    window.event = {};
    event.stopPropagation();
    expect(window.event.cancelBubble).toBe(true);
    delete window.event;
  });
  test('stopPropagation IE 分支写到传入的 evt 而非 window.event', () => {
    window.event = {};
    const evt = {};
    event.stopPropagation(evt);
    expect(evt.cancelBubble).toBe(true);
    expect(window.event.cancelBubble).toBeUndefined();
    delete window.event;
  });
  test('preventDefault 优先原生方法', () => {
    const evt = { preventDefault: jest.fn() };
    event.preventDefault(evt);
    expect(evt.preventDefault).toHaveBeenCalled();
  });
  test('preventDefault evt 与 window.event 均缺失时抛 TypeError', () => {
    delete window.event;
    expect(() => event.preventDefault()).toThrow(TypeError);
  });
  test('preventDefault 无参调用回退 window.event 置 returnValue（IE8- attachEvent 回调无参）', () => {
    window.event = {};
    event.preventDefault();
    expect(window.event.returnValue).toBe(false);
    delete window.event;
  });
  test('preventDefault IE 分支写到传入的 evt 而非 window.event', () => {
    window.event = {};
    const evt = {};
    event.preventDefault(evt);
    expect(evt.returnValue).toBe(false);
    expect(window.event.returnValue).toBeUndefined();
    delete window.event;
  });
});

describe('事件监听', () => {
  const handler = () => {};
  test('addEvent/removeEvent DOM2 addEventListener 分支', () => {
    const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    expect(event.addEvent(target, 'click', handler)).toBe(true);
    expect(target.addEventListener).toHaveBeenCalledWith('click', handler, false);
    event.addEvent(target, 'click', handler, true);
    expect(target.addEventListener).toHaveBeenLastCalledWith('click', handler, true);
    expect(event.removeEvent(target, 'click', handler)).toBe(true);
    expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, false);
  });
  test('addEvent/removeEvent IE attachEvent 分支', () => {
    const target = { attachEvent: jest.fn(), detachEvent: jest.fn() };
    expect(event.addEvent(target, 'click', handler)).toBe(true);
    expect(target.attachEvent).toHaveBeenCalledWith('onclick', handler);
    event.removeEvent(target, 'click', handler);
    expect(target.detachEvent).toHaveBeenCalledWith('onclick', handler);
  });
  test('addEvent/removeEvent DOM0 onxxx 分支', () => {
    const target = {};
    expect(event.addEvent(target, 'click', handler)).toBe(true);
    expect(target.onclick).toBe(handler);
    event.removeEvent(target, 'click', handler);
    expect(target.onclick).toBeNull();
  });
  test('addEventListener 属性存在但非函数时回退 DOM0 不抛错', () => {
    const target = { addEventListener: 'oops' };
    expect(event.addEvent(target, 'click', handler)).toBe(true);
    expect(target.onclick).toBe(handler);
  });
  test('addEvent/removeEvent 事件名首尾空白自动截去', () => {
    const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    event.addEvent(target, ' click ', handler);
    expect(target.addEventListener).toHaveBeenCalledWith('click', handler, false);
    event.removeEvent(target, 'click ', handler);
    expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, false);
  });
  test('addEvent/removeEvent 空参与非法入参不抛错返回 false', () => {
    const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    // target 为空或原始类型：原始类型上挂属性会抛 TypeError，直接拦
    expect(event.addEvent(null, 'click', handler)).toBe(false);
    expect(event.removeEvent(123, 'click', handler)).toBe(false);
    // type 非字符串或纯空白：现代浏览器会隐式转成永不触发的事件名，直接拦
    expect(event.addEvent(target, 123, handler)).toBe(false);
    expect(event.addEvent(target, '  ', handler)).toBe(false);
    expect(event.removeEvent(target, ['click'], handler)).toBe(false);
    // handler 非函数：null/undefined 原生为静默 no-op，字符串等形式抛 TypeError，统一拦
    expect(event.addEvent(target, 'click')).toBe(false);
    expect(event.removeEvent(target, 'click', null)).toBe(false);
    expect(target.addEventListener).not.toHaveBeenCalled();
    expect(target.removeEventListener).not.toHaveBeenCalled();
  });
});
