import crypt from '../index';

describe('加密', () => {
  [{
    input: 'A',
    output: 'GG==',
  }, {
    input: '007',
    output: 'C30t',
  }, {
    input: '123456',
    output: 'CJ8pD3Ks',
  }, {
    input: 'ABC',
    output: 'GK93',
  }, {
    input: '©',
    output: 'mga=',
  }].forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(crypt.encode(el.input)).toBe(el.output);
    });
  });
});

describe('解密', () => {
  [{
    input: 'GG==',
    output: 'A',
  }, {
    input: 'C30t',
    output: '007',
  }, {
    input: 'CJ8pD3Ks',
    output: '123456',
  }, {
    input: 'GK93',
    output: 'ABC',
  }, {
    input: 'mga=',
    output: '©',
  }].forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(crypt.decode(el.input)).toBe(el.output);
    });
  });
});
