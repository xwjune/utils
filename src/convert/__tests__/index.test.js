import bytesToSize from '../bytesToSize';
import fenToYuan from '../fenToYuan';
import yuanToFen from '../yuanToFen';
import numberToCn from '../numberToCn';
import currencyToCn from '../currencyToCn';
import combination from '../combination';
import toThousands from '../toThousands';
import expandNumber from '../expandNumber';
import toFixed from '../toFixed';

describe('数据容量单位换算', () => {
  const testMap = [{
    input: '',
    output: '0B',
  }, {
    input: '32g',
    output: '0B',
  }, {
    input: -10,
    output: '0B',
  }, {
    input: 0,
    output: '0B',
  }, {
    input: 0.3,
    output: '0.3B',
  }, {
    input: 1e-7, // Number 科学计数法先展开再转换
    output: '0.0000001B',
  }, {
    input: '1e-7', // 字符串科学计数法同样展开
    output: '0.0000001B',
  }, {
    input: NaN, // 非有限数字
    output: '0B',
  }, {
    input: Infinity,
    output: '0B',
  }, {
    input: 'Infinity', // Number('Infinity') === Infinity
    output: '0B',
  }, {
    input: '1e999', // Number('1e999') === Infinity
    output: '0B',
  }, {
    input: 10000,
    output: '9.8KB',
  }, {
    input: 10240,
    output: '10.0KB',
  }, {
    input: 1024 * 32,
    output: '32.0KB',
  }, {
    input: 1024 * 1024,
    output: '1.0MB',
  }, {
    input: 1024 ** 3,
    output: '1.0GB',
  }, {
    input: 1024 ** 4,
    output: '1.0TB',
  }, {
    input: 1024 ** 5,
    output: '1.0PB',
  }, {
    input: 1024 ** 6,
    output: '1.0EB',
  }, {
    input: 1024 ** 7,
    output: '1.0ZB',
  }, {
    input: 1024 ** 8,
    output: '1.0YB',
  }, {
    input: 1024 ** 9,
    output: '1.0BB',
  }, {
    input: 1024 ** 10,
    output: '1.0NB',
  }, {
    input: 1024 ** 11,
    output: '1.0DB',
  }, {
    input: 1024 ** 12,
    output: '1.0CB',
  }, {
    input: 1024 ** 13,
    output: '1024.0CB',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(bytesToSize(el.input)).toBe(el.output);
    });
  });
  test('保留两位有效数：10240 => 10.00KB', () => {
    expect(bytesToSize(10240, 2)).toBe('10.00KB');
  });
  test('非有限数字返回 format', () => {
    expect(bytesToSize(NaN, 1, '--')).toBe('--');
    expect(bytesToSize(Infinity, 1, '--')).toBe('--');
    expect(bytesToSize('Infinity', 1, '--')).toBe('--');
  });
  test('digit 非法值回退默认 1，不抛 RangeError', () => {
    expect(bytesToSize(10000, -1)).toBe('9.8KB');
    expect(bytesToSize(10000, 101)).toBe('9.8KB');
    expect(bytesToSize(10000, 'x')).toBe('9.8KB');
  });
});

describe('分转化成元', () => {
  const testMap = [{
    input: undefined,
    output: '0.00',
  }, {
    input: null,
    output: '0.00',
  }, {
    input: '',
    output: '0.00',
  }, {
    input: 0.2,
    output: '0.00',
  }, {
    input: 0,
    output: '0.00',
  }, {
    input: '0',
    output: '0.00',
  }, {
    input: -0,
    output: '0.00',
  }, {
    input: '-0',
    output: '0.00',
  }, {
    input: -0.4, // 舍去小数部分后为负零
    output: '0.00',
  }, {
    input: 1e-7, // Number 科学计数法先展开再转换
    output: '0.00',
  }, {
    input: 1e21, // Number 科学计数法先展开再转换
    output: '10000000000000000000.00',
  }, {
    input: .2, // eslint-disable-line no-floating-decimal
    output: '0.00',
  }, {
    input: '0.2',
    output: '0.00',
  }, {
    input: '-0.2', // 舍去小数部分后为负零
    output: '0.00',
  }, {
    input: '2.0',
    output: '0.02',
  }, {
    input: '2',
    output: '0.02',
  }, {
    input: '20',
    output: '0.20',
  }, {
    input: '200',
    output: '2.00',
  }, {
    input: '2000',
    output: '20.00',
  }, {
    input: '2000.45',
    output: '20.00',
  }, {
    input: '-2000',
    output: '-20.00',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(fenToYuan(el.input)).toBe(el.output);
    });
  });
  test('去掉小数末尾多余的零', () => {
    expect(fenToYuan(2000, { cutZero: true })).toBe('20');
  });
  test('数字千位符分隔', () => {
    expect(fenToYuan(200000, { toThousands: true })).toBe('2,000.00');
    expect(fenToYuan(200000, { toThousands: true, cutZero: true })).toBe('2,000');
    expect(fenToYuan(200022, { toThousands: true })).toBe('2,000.22');
  });
  test('error', () => {
    expect(fenToYuan('.2')).toBe('');
    expect(fenToYuan('-.2')).toBe('');
    expect(fenToYuan('1e+21')).toBe('');
    expect(fenToYuan('null')).toBe('');
    expect(fenToYuan('num')).toBe('');
  });
  test('空数据', () => {
    expect(fenToYuan()).toBe('0.00');
    expect(fenToYuan(undefined)).toBe('0.00');
    expect(fenToYuan(null)).toBe('0.00');
    expect(fenToYuan('')).toBe('0.00');
    expect(fenToYuan(undefined, { format: '--' })).toBe('--');
  });
  test('options 显式传 null 兜底为默认配置', () => {
    expect(fenToYuan(2000, null)).toBe('20.00');
  });
});

describe('元转化为分', () => {
  const testMap = [{
    input: undefined,
    output: '0',
  }, {
    input: null,
    output: '0',
  }, {
    input: '',
    output: '0',
  }, {
    input: '0.000',
    output: '0',
  }, {
    input: '0.001',
    output: '0',
  }, {
    input: '0.010',
    output: '1',
  }, {
    input: '0.101',
    output: '10',
  }, {
    input: '0.00',
    output: '0',
  }, {
    input: '0.01',
    output: '1',
  }, {
    input: '0.10',
    output: '10',
  }, {
    input: '0.0',
    output: '0',
  }, {
    input: '0.1',
    output: '10',
  }, {
    input: 0,
    output: '0',
  }, {
    input: -0,
    output: '0',
  }, {
    input: '-0',
    output: '0',
  }, {
    input: -0.001, // 只保留两位小数后为负零
    output: '0',
  }, {
    input: 1e-7, // Number 科学计数法先展开再转换
    output: '0',
  }, {
    input: 1e21, // Number 科学计数法先展开再转换
    output: '100000000000000000000000',
  }, {
    input: 0.1,
    output: '10',
  }, {
    input: .1, // eslint-disable-line no-floating-decimal
    output: '10',
  }, {
    input: '10',
    output: '1000',
  }, {
    input: '10.0201',
    output: '1002',
  }, {
    input: '-10.0201',
    output: '-1002',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(yuanToFen(el.input)).toBe(el.output);
    });
  });
  test('error', () => {
    expect(yuanToFen('.2')).toBe('');
    expect(yuanToFen('-.2')).toBe('');
    expect(yuanToFen('null')).toBe('');
    expect(yuanToFen('1e2')).toBe(''); // 字符串科学计数法不展开，视为错误数据
    expect(yuanToFen('1e+21')).toBe('');
  });
  test('空值格式化', () => {
    expect(yuanToFen(null, '--')).toBe('--');
    expect(yuanToFen('', '--')).toBe('--');
    expect(yuanToFen(undefined, '--')).toBe('--');
  });
});

describe('阿拉伯数字转中文', () => {
  const testMap = [{
    input: '0',
    output: '零',
  }, {
    input: '0.00',
    output: '零点零零',
  }, {
    input: '0.01',
    output: '零点零壹',
  }, {
    input: '0.10',
    output: '零点壹零',
  }, {
    input: '1',
    output: '壹',
  }, {
    input: '10',
    output: '壹拾',
  }, {
    input: '100',
    output: '壹佰',
  }, {
    input: '1000',
    output: '壹仟',
  }, {
    input: '1008',
    output: '壹仟零捌',
  }, {
    input: '1080',
    output: '壹仟零捌拾',
  }, {
    input: '10000',
    output: '壹万',
  }, {
    input: '10008',
    output: '壹万零捌',
  }, {
    input: '108000',
    output: '壹拾万捌仟',
  }, {
    input: '10000000',
    output: '壹仟万',
  }, {
    input: '10000800',
    output: '壹仟万零捌佰',
  }, {
    input: '10008000',
    output: '壹仟万捌仟',
  }, {
    input: '100000000',
    output: '壹亿',
  }, {
    input: '100000008',
    output: '壹亿零捌',
  }, {
    input: '100000800',
    output: '壹亿零捌佰',
  }, {
    input: '100080000',
    output: '壹亿零捌万',
  }, {
    input: '100080800',
    output: '壹亿零捌万零捌佰',
  }, {
    input: '100008000',
    output: '壹亿零捌仟',
  }, {
    input: '10000000000',
    output: '壹佰亿',
  }, {
    input: '999999999999.99',
    output: '玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖点玖玖',
  }, {
    // Number 类型入参：走 expandNumber 展开逻辑
    input: 0.1,
    output: '零点壹',
  }, {
    input: 1008,
    output: '壹仟零捌',
  }, {
    input: 0.0000001, // String(1e-7) === '1e-7'，展开为 '0.0000001'
    output: '零点零零零零零零壹',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(numberToCn(el.input)).toBe(el.output);
    });
  });
  test('数据错误', () => {
    expect(numberToCn()).toBe('数据错误');
    expect(numberToCn(null)).toBe('数据错误');
    expect(numberToCn('')).toBe('数据错误');
    expect(numberToCn(undefined)).toBe('数据错误');
    expect(numberToCn('-12')).toBe('数据错误');
    expect(numberToCn('12x')).toBe('数据错误');
    expect(numberToCn('.2')).toBe('数据错误');
    expect(numberToCn('-.2')).toBe('数据错误');
    expect(numberToCn('1e+21')).toBe('数据错误');
    expect(numberToCn(-1e-7)).toBe('数据错误'); // 展开为 '-0.0000001'，负数不合法
  });
  test('边界值', () => {
    expect(numberToCn(1000000000000)).toBe('超大数字');
    expect(numberToCn(1e+21)).toBe('超大数字'); // 1000000000000000000000
  });
});

describe('数字金额转换为中文人民币大写', () => {
  const testMap = [{
    input: undefined,
    output: '零元整',
  }, {
    input: null,
    output: '零元整',
  }, {
    input: '',
    output: '零元整',
  }, {
    input: '0',
    output: '零元整',
  }, {
    input: '0.0',
    output: '零元整',
  }, {
    input: '0.00',
    output: '零元整',
  }, {
    input: '0.01',
    output: '零壹分',
  }, {
    input: '0.10',
    output: '壹角',
  }, {
    input: 0.1,
    output: '壹角',
  }, {
    input: .1, // eslint-disable-line no-floating-decimal
    output: '壹角',
  }, {
    input: '1.01',
    output: '壹元零壹分',
  }, {
    input: '1.10',
    output: '壹元壹角',
  }, {
    input: '1.00',
    output: '壹元整',
  }, {
    input: '1.0',
    output: '壹元整',
  }, {
    input: '1',
    output: '壹元整',
  }, {
    input: '1000',
    output: '壹仟元整',
  }, {
    input: '10000',
    output: '壹万元整',
  }, {
    input: '10000.08',
    output: '壹万元零捌分',
  }, {
    input: '10008',
    output: '壹万零捌元整',
  }, {
    input: '108000',
    output: '壹拾万捌仟元整',
  }, {
    input: '10000800',
    output: '壹仟万零捌佰元整',
  }, {
    input: '10008000',
    output: '壹仟万捌仟元整',
  }, {
    input: '100000000',
    output: '壹亿元整',
  }, {
    input: '100000800',
    output: '壹亿零捌佰元整',
  }, {
    input: '999999999999.99',
    output: '玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(currencyToCn(el.input)).toBe(el.output);
    });
  });
  test('错误输入', () => {
    expect(currencyToCn('1x')).toBe('数据错误');
    expect(currencyToCn('-12')).toBe('数据错误');
    expect(currencyToCn('.2')).toBe('数据错误');
    expect(currencyToCn('1e+21')).toBe('数据错误');
  });
  test('空值输入', () => {
    expect(currencyToCn()).toBe('零元整');
    expect(currencyToCn(undefined)).toBe('零元整');
    expect(currencyToCn(null)).toBe('零元整');
    expect(currencyToCn('')).toBe('零元整');
  });
  test('空值格式化', () => {
    expect(currencyToCn(undefined, '--')).toBe('--');
  });
  test('边界值', () => {
    expect(currencyToCn(1000000000000)).toBe('超大金额');
    expect(currencyToCn(1e21)).toBe('超大金额');
  });
  test('科学计数法数字', () => {
    expect(currencyToCn(0.0000001)).toBe('零元整');
    expect(currencyToCn(1.5e-7)).toBe('零元整');
    // 字符串形式的科学计数法仍视为非法
    expect(currencyToCn('1e-7')).toBe('数据错误');
  });
  test('边界判断不受浮点进位影响', () => {
    expect(currencyToCn('999999999999.990001')).toBe('超大金额');
    expect(currencyToCn('999999999999.995')).toBe('超大金额');
    // 0.990 与 0.99 数值相等，正常转换
    expect(currencyToCn('999999999999.990')).toBe('玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分');
  });
});

describe('列出n个数组所有组合', () => {
  const source = [
    ['黑色', '白色'],
    ['64G', '128G'],
    ['国行', '港行'],
    ['全网通'],
  ];
  const result = [
    ['黑色', '64G', '国行', '全网通'],
    ['黑色', '64G', '港行', '全网通'],
    ['黑色', '128G', '国行', '全网通'],
    ['黑色', '128G', '港行', '全网通'],
    ['白色', '64G', '国行', '全网通'],
    ['白色', '64G', '港行', '全网通'],
    ['白色', '128G', '国行', '全网通'],
    ['白色', '128G', '港行', '全网通'],
  ];
  test('combination', () => {
    expect(combination(source)).toEqual(result);
  });
});

describe('数字千位符分隔', () => {
  const testMap = [{
    input: 12,
    output: '12',
  }, {
    input: 0.2,
    output: '0.2',
  }, {
    input: .2, // eslint-disable-line no-floating-decimal
    output: '0.2',
  }, {
    input: '12',
    output: '12',
  }, {
    input: '123',
    output: '123',
  }, {
    input: '1234',
    output: '1,234',
  }, {
    input: '12345',
    output: '12,345',
  }, {
    input: '123456',
    output: '123,456',
  }, {
    input: '1234567',
    output: '1,234,567',
  }, {
    input: '1234.56',
    output: '1,234.56',
  }, {
    input: '1234.5678',
    output: '1,234.5678',
  }, {
    input: '-1234.5678',
    output: '-1,234.5678',
  }, {
    input: '1e+21', // 字符串科学计数法先展开再分隔
    output: '1,000,000,000,000,000,000,000',
  }, {
    input: 1e21, // Number 科学计数法先展开再分隔
    output: '1,000,000,000,000,000,000,000',
  }, {
    input: 1e-7,
    output: '0.0000001',
  }, {
    input: '+2000', // 前导 + 号规范化
    output: '2,000',
  }, {
    input: '+1e3', // 前导 + 号与科学计数法同时存在
    output: '1,000',
  }, {
    input: '0.5e5', // 前导零规范化后再分隔
    output: '50,000',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(toThousands(el.input)).toBe(el.output);
    });
  });
  test('error', () => {
    expect(toThousands()).toBe('');
    expect(toThousands(undefined)).toBe('');
    expect(toThousands(null)).toBe('');
    expect(toThousands('')).toBe('');
    expect(toThousands('.2')).toBe('');
    expect(toThousands('-.2')).toBe('');
    expect(toThousands('x12')).toBe('');
    expect(toThousands('1.2.')).toBe('');
    expect(toThousands(NaN)).toBe(''); // 非有限数字，此前会原样返回 'NaN'
    expect(toThousands(Infinity)).toBe('');
  });
});

describe('科学计数法展开', () => {
  const testMap = [{
    input: 1.5,
    output: '1.5', // 非科学计数法原样返回
  }, {
    input: 1e-7,
    output: '0.0000001', // 小数点前移到数字串开头之前
  }, {
    input: -1e-7,
    output: '-0.0000001',
  }, {
    input: -1e-7,
    output: '-0.0000001',
  }, {
    input: '1e+21',
    output: '1000000000000000000000',
  }, {
    input: -1.5e21,
    output: '-1500000000000000000000',
  }, {
    input: '0.123e2',
    output: '12.3', // 纯小数尾数右移小数点产生前导零，规范化【'012.3'】
  }, {
    input: '0.5e5',
    output: '50000', // 规范化【'050000'】
  }, {
    input: '-0.5e5',
    output: '-50000',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(expandNumber(el.input)).toBe(el.output);
    });
  });
  test('小数点落在数字串中间', () => {
    // JS 对 Number 只在 >=1e21 或 <1e-6 时才输出科学计数法，小数点必然移出数字串，
    // 中间分支只能直接传入科学计数法字面量覆盖
    expect(expandNumber('12.34e1')).toBe('123.4');
    expect(expandNumber('-12.34e-1')).toBe('-1.234');
  });
});

describe('格式化数字保留N位小数', () => {
  const testMap = [{
    input: 3.14159,
    output: '3.14', // 被舍弃首位 < 5 直接舍去
  }, {
    input: 3.14159,
    digit: 3,
    output: '3.142',
  }, {
    input: 3,
    output: '3.00', // 不足位数补零
  }, {
    input: 3.1,
    output: '3.10',
  }, {
    input: 3.14,
    output: '3.14', // 小数位恰好等于保留位数
  }, {
    input: 1.005,
    output: '1.01', // 基于字面量四舍五入，此前 (1.005).toFixed(2) => '1.00'
  }, {
    input: 1.255,
    output: '1.26', // 被舍弃首位 === 5 进一
  }, {
    input: 1.2549,
    output: '1.25',
  }, {
    input: 9.999,
    output: '10.00', // 连锁进位
  }, {
    input: 0.999,
    output: '1.00',
  }, {
    input: 99.999,
    output: '100.00',
  }, {
    input: 1e-7,
    output: '0.00', // Number 科学计数法先展开再转换
  }, {
    input: '1e-7',
    output: '0.00', // 字符串科学计数法同样展开
  }, {
    input: 1e+21,
    output: '1000000000000000000000.00',
  }, {
    input: '+2000',
    output: '2000.00', // 前导 + 号规范化
  }, {
    input: -3.14159,
    output: '-3.14',
  }, {
    input: -1.005,
    output: '-1.01', // 负数按绝对值四舍五入
  }, {
    input: '-0.004',
    output: '0.00', // 负零归一化
  }, {
    input: '0.123e2',
    output: '12.30', // 前导零规范化【展开后 '012.3'】
  }, {
    input: '0.5e5',
    output: '50000.00',
  }];
  testMap.forEach((el) => {
    test(`${el.input}${el.digit !== undefined ? `, ${el.digit}` : ''} => ${el.output}`, () => {
      expect(toFixed(el.input, { digit: el.digit })).toBe(el.output);
    });
  });
  test('保留 0 位小数', () => {
    expect(toFixed(3.7, { digit: 0 })).toBe('4');
    expect(toFixed(3.2, { digit: 0 })).toBe('3');
    expect(toFixed(9.9, { digit: 0 })).toBe('10');
    expect(toFixed(-0.4, { digit: 0 })).toBe('0'); // 负零归一化
  });
  test('去掉小数末尾多余的零', () => {
    expect(toFixed('3.10', { cutZero: true })).toBe('3.1');
    expect(toFixed(3.1, { cutZero: true })).toBe('3.1');
    expect(toFixed(3, { cutZero: true })).toBe('3'); // 小数全为零时连小数点一并去掉
    expect(toFixed(1.01, { cutZero: true })).toBe('1.01'); // 末尾无零原样返回
    expect(toFixed(9.999, { cutZero: true })).toBe('10'); // 先四舍五入再去零
    expect(toFixed(-1.01, { cutZero: true })).toBe('-1.01');
    expect(toFixed('-0.004', { cutZero: true })).toBe('0'); // 负零归一化
    expect(toFixed(3.7, { digit: 0, cutZero: true })).toBe('4'); // 无小数部分原样返回
  });
  test('数字千位符分隔', () => {
    expect(toFixed(1234567.89, { toThousands: true })).toBe('1,234,567.89');
    expect(toFixed(1234567, { toThousands: true })).toBe('1,234,567.00');
    expect(toFixed(1234567, { toThousands: true, cutZero: true })).toBe('1,234,567');
    expect(toFixed(-1234567.89, { toThousands: true })).toBe('-1,234,567.89');
    expect(toFixed(1234.005, { toThousands: true })).toBe('1,234.01'); // 先四舍五入再分隔
    expect(toFixed(1234.56789, { digit: 3, toThousands: true })).toBe('1,234.568');
    expect(toFixed(100, { toThousands: true })).toBe('100.00'); // 不足四位不加分隔符
    expect(toFixed(1e+21, { toThousands: true })).toBe('1,000,000,000,000,000,000,000.00');
  });
  test('digit 非法值回退默认 2', () => {
    expect(toFixed(3.14159, { digit: -1 })).toBe('3.14');
    expect(toFixed(3.14159, { digit: 101 })).toBe('3.14');
    expect(toFixed(3.14159, { digit: 'x' })).toBe('3.14');
    expect(toFixed(3.14159, { digit: null })).toBe('3.14'); // Number(null) => 0，隐式转换值同样回退
    expect(toFixed(3.14159, { digit: '' })).toBe('3.14'); // Number('') => 0
    expect(toFixed(3.14159, { digit: true })).toBe('3.14'); // Number(true) => 1
  });
  test('digit 字符串数字同样接受', () => {
    expect(toFixed(3.14159, { digit: '3' })).toBe('3.142');
  });
  test('options 显式传 null 兜底为默认配置', () => {
    expect(toFixed(3.14159, null)).toBe('3.14');
  });
  test('错误数据返回空字符串', () => {
    expect(toFixed()).toBe('');
    expect(toFixed(null)).toBe('');
    expect(toFixed('')).toBe('');
    expect(toFixed('num')).toBe('');
    expect(toFixed(NaN)).toBe('');
    expect(toFixed(Infinity)).toBe('');
    expect(toFixed([20])).toBe(''); // 隐式转换字符串的类数组不纳入
  });
  test('错误数据返回 format 占位符', () => {
    expect(toFixed('num', { format: '--' })).toBe('--');
    expect(toFixed(null, { format: '--' })).toBe('--');
    expect(toFixed(undefined, { format: '--' })).toBe('--');
  });
  test('超大数与精度边界', () => {
    // 超出双精度表示范围【Number => Infinity】视为错误数据
    expect(toFixed('1e309')).toBe('');
    expect(toFixed(`1${'0'.repeat(400)}`)).toBe('');
    // 纯字符串管线，不受 Number.MAX_SAFE_INTEGER【2^53】限制，整数位精确保留
    expect(toFixed('9007199254740993')).toBe('9007199254740993.00');
    // 接近表示上限，展开为 309 位十进制
    expect(toFixed(1e308)).toBe(`1${'0'.repeat(308)}.00`);
  });
});
