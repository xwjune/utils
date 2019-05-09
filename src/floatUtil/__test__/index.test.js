import floatUtil from '../index';

describe('加法', () => {
  [{
    arg1: 0.1,
    arg2: 0.2,
    output: 0.3,
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
    test(`${el.arg1} + ${el.arg2} => ${el.output}`, () => {
      expect(floatUtil.add(el.arg1, el.arg2)).toBe(el.output);
    });
  });
  test('错误输入', () => {
    expect(floatUtil.add(2.22, 'xx', '--')).toBe('--');
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
  }].forEach((el) => {
    test(`${el.arg1} + ${el.arg2} => ${el.output}`, () => {
      expect(floatUtil.subtract(el.arg1, el.arg2)).toBe(el.output);
    });
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
    arg1: 9.7,
    arg2: 100,
    output: 970,
  }, {
    arg1: 39.7,
    arg2: 100,
    output: 3970,
  }].forEach((el) => {
    test(`${el.arg1} + ${el.arg2} => ${el.output}`, () => {
      expect(floatUtil.multiply(el.arg1, el.arg2)).toBe(el.output);
    });
  });
});

describe('除法', () => {
  [{
    arg1: 0.3,
    arg2: 0.1,
    output: 3,
  }, {
    arg1: 0.69,
    arg2: 10,
    output: 0.069,
  }, {
    arg1: 11.2,
    arg2: 100,
    output: 0.112,
  }].forEach((el) => {
    test(`${el.arg1} + ${el.arg2} => ${el.output}`, () => {
      expect(floatUtil.divide(el.arg1, el.arg2)).toBe(el.output);
    });
  });
});
