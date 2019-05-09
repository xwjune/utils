import { filterNull } from '../filter';

describe('空数据过滤', () => {
  [{
    input: 'xxx',
    output: 'xxx',
  }, {
    input: '',
    output: '',
  }, {
    input: null,
    output: '',
  }].forEach((el) => {
    test(`${el.input} => ${el.output}`, () => {
      expect(filterNull(el.input)).toBe(el.output);
    });
  });
  test('格式化', () => {
    expect(filterNull(null, '--')).toBe('--');
  });
});
