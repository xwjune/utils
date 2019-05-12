import bytesToSize from '../bytesToSize';
import fenToYuan from '../fenToYuan';
import yuanToFen from '../yuanToFen';
import currencyToCn from '../currencyToCn';

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
});

describe('分转化成元', () => {
  const testMap = [{
    input: '',
    output: '0.00',
  }, {
    input: '0.2',
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
    expect(fenToYuan(2000, '0', true)).toBe('20');
  });
  test('空值格式化', () => {
    expect(fenToYuan(null, '--')).toBe('--');
  });
});

describe('元转化为分', () => {
  const testMap = [{
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
    input: '10',
    output: '1000',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(yuanToFen(el.input)).toBe(el.output);
    });
  });
  test('空值格式化', () => {
    expect(yuanToFen(null, '--')).toBe('--');
  });
});

describe('数字金额转换为中文人民币大写', () => {
  const testMap = [{
    input: '0',
    output: '零元整',
  }, {
    input: '0.0',
    output: '零元整',
  }, {
    input: '0.00',
    output: '零元整',
  }, {
    input: '-0.00',
    output: '负零元整',
  }, {
    input: '0.01',
    output: '零壹分',
  }, {
    input: '0.10',
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
    input: '100',
    output: '壹佰元整',
  }, {
    input: '10000',
    output: '壹万元整',
  }, {
    input: '10001',
    output: '壹万零壹元整',
  }, {
    input: '100001',
    output: '壹拾万零壹元整',
  }, {
    input: '10000010',
    output: '壹仟万零壹拾元整',
  }, {
    input: '100000000',
    output: '壹亿元整',
  }, {
    input: '100000001',
    output: '壹亿零壹元整',
  }];
  testMap.forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(currencyToCn(el.input)).toBe(el.output);
    });
  });
  test('空值输入', () => {
    expect(currencyToCn()).toBe('零元整');
  });
  test('空值格式化', () => {
    expect(currencyToCn('', '--')).toBe('--');
  });
  test('边界值', () => {
    expect(currencyToCn('1000000000000')).toBe('超大金额');
  });
});
