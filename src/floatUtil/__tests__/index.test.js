import floatUtil from '../index';

describe('加法', () => {
  [{
    arg1: 0.1,
    arg2: 0.2,
    output: 0.3,
  }, {
    arg1: -0.2,
    arg2: 0.3,
    output: 0.1,
  }, {
    arg1: 0.1,
    arg2: 0.7,
    output: 0.8,
  }, {
    arg1: 0.2,
    arg2: 0.4,
    output: 0.6,
  }, {
    arg1: 0.1,
    arg2: 2.22,
    output: 2.32,
  }].forEach((el) => {
    test(`${el.arg1} + ${el.arg2} = ${el.output}`, () => {
      expect(floatUtil.add(el.arg1, el.arg2)).toBe(el.output);
      expect(el.arg1 + el.arg2).not.toBe(el.output);
    });
  });
  test('整数输入', () => {
    expect(floatUtil.add(2, 2)).toBe(4);
  });
  test('错误输入', () => {
    expect(floatUtil.add(2.22, '2g', '--')).toBe('--');
  });
  test('超出安全整数范围', () => {
    // 放大后的整数 9999999999999990 > Number.MAX_SAFE_INTEGER(9007199254740991)
    expect(floatUtil.add(999999999999999, 0.1, '--')).toBe('--');
    expect(floatUtil.add(9007199254740992, 0.1, '--')).toBe('--');
  });
  test('超出双精度表示范围的数字字符串', () => {
    expect(floatUtil.add(`1${'0'.repeat(400)}`, 1, '--')).toBe('--');
  });
  test('小数位数溢出', () => {
    // 10 ** 401 => Infinity
    expect(floatUtil.add(`0.${'0'.repeat(400)}1`, `0.${'0'.repeat(400)}1`, '--')).toBe('--');
  });
});

describe('减法', () => {
  [{
    arg1: 1.5,
    arg2: 1.2,
    output: 0.3,
  }, {
    arg1: 0.3,
    arg2: 0.2,
    output: 0.1,
  }, {
    arg1: 0.2,
    arg2: -0.1,
    output: 0.3,
  }].forEach((el) => {
    test(`${el.arg1} - ${el.arg2} = ${el.output}`, () => {
      expect(floatUtil.subtract(el.arg1, el.arg2)).toBe(el.output);
      expect(el.arg1 - el.arg2).not.toBe(el.output);
    });
  });
  test('整数输入', () => {
    expect(floatUtil.subtract(2, 2)).toBe(0);
  });
  test('错误输入', () => {
    expect(floatUtil.subtract(2.22, '2g', '--')).toBe('--');
  });
  test('超出安全整数范围', () => {
    expect(floatUtil.subtract(999999999999999, 0.1, '--')).toBe('--');
  });
});

describe('乘法', () => {
  [{
    arg1: 19.9,
    arg2: 100,
    output: 1990,
  }, {
    arg1: 0.7,
    arg2: 180,
    output: 126,
  }, {
    arg1: -0.7,
    arg2: 180,
    output: -126,
  }, {
    arg1: 9.7,
    arg2: 100,
    output: 970,
  }, {
    arg1: 39.7,
    arg2: 100,
    output: 3970,
  }].forEach((el) => {
    test(`${el.arg1} * ${el.arg2} = ${el.output}`, () => {
      expect(floatUtil.multiply(el.arg1, el.arg2)).toBe(el.output);
      expect(el.arg1 * el.arg2).not.toBe(el.output);
    });
  });
  test('整数输入', () => {
    expect(floatUtil.multiply(2, 2)).toBe(4);
  });
  test('错误输入', () => {
    expect(floatUtil.multiply(2.22, '2g')).toBe('');
  });
  test('乘积超出安全整数范围', () => {
    // 1000000000 * 1000000000 = 1e18 > Number.MAX_SAFE_INTEGER
    expect(floatUtil.multiply(1000000000, 1000000000, '--')).toBe('--');
  });
});

describe('除法', () => {
  [{
    arg1: 0.3,
    arg2: 0.1,
    output: 3,
  }, {
    arg1: -0.3,
    arg2: 0.1,
    output: -3,
  }, {
    arg1: 0.69,
    arg2: 10,
    output: 0.069,
  }, {
    arg1: 11.2,
    arg2: 100,
    output: 0.112,
  }].forEach((el) => {
    test(`${el.arg1} / ${el.arg2} = ${el.output}`, () => {
      expect(floatUtil.divide(el.arg1, el.arg2)).toBe(el.output);
      expect(el.arg1 / el.arg2).not.toBe(el.output);
    });
  });
  test('整数输入', () => {
    expect(floatUtil.divide(2, 2)).toBe(1);
  });
  test('错误输入', () => {
    expect(floatUtil.divide(2.22, '2g')).toBe('');
  });
  test('除数为 0', () => {
    expect(floatUtil.divide(1, 0, '--')).toBe('--');
    expect(floatUtil.divide(1, '0.0', '--')).toBe('--');
    expect(floatUtil.divide(0, 0, '--')).toBe('--');
  });
  test('超出安全整数范围', () => {
    // 放大后的整数 9999999999999990 > Number.MAX_SAFE_INTEGER(9007199254740991)
    expect(floatUtil.divide(999999999999999, 0.1, '--')).toBe('--');
  });
});
