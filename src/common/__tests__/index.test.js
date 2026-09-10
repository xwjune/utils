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
  });
  test('options 显式传 null 兜底为空配置', () => {
    common.setCookie('jun-utils-null', 'value2', null);
    expect(common.getCookie('jun-utils-null')).toBe('value2');
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
});
