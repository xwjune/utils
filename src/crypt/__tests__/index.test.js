import crypt from '../index';

describe('加密', () => {
  [{
    input: '',
    output: '',
  }, {
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
    test(`${JSON.stringify(el.input)} => ${el.output}`, () => {
      expect(crypt.encode(el.input)).toBe(el.output);
    });
  });

  test('非字符串抛 TypeError', () => {
    [null, undefined, 123, {}].forEach((value) => {
      expect(() => crypt.encode(value)).toThrow(TypeError);
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
  }, {
    // 非法字符（URL 痕迹）剔除后照常解密
    input: ' CJ8+pD3Ks',
    output: '123456',
  }].forEach((el) => {
    test(`${el.input} => ${JSON.stringify(el.output)}`, () => {
      expect(crypt.decode(el.input)).toBe(el.output);
    });
  });

  test('空串', () => {
    expect(crypt.decode('')).toBe('');
  });

  test('非字符串抛 TypeError', () => {
    [null, undefined, 123, {}].forEach((value) => {
      expect(() => crypt.decode(value)).toThrow(TypeError);
    });
  });

  test('残缺密文（长度非 4 的倍数）抛 Error，不再静默解出乱码', () => {
    // 旧实现会解成 '12345\x00'
    expect(() => crypt.decode('CJ8pD3K')).toThrow(Error);
  });

  test('填充符出现在中途抛 Error，不再静默解出乱码', () => {
    // 旧实现会解成 ',\x02C'
    expect(() => crypt.decode('A=93')).toThrow(Error);
    expect(() => crypt.decode('AB=C')).toThrow(Error);
  });
});

describe('畸形 UTF-8 容错', () => {
  // 密文结构合法（长度、填充都对）但解出的字节流不是合法 UTF-8：
  // encode 产不出这种密文，只有手工构造或数据损坏才会出现，此时以 U+FFFD 替换坏序列、不抛错
  // 密文按本模块索引表手工构造，括号内为该密文解出的字节流
  [{
    input: 'W820', // [0x80, 0x80, 0x80] 孤立延续字节 x3
    output: '���',
  }, {
    input: 'ma51', // [0xC2, 0x41, 0x41] 2 字节头 + 非法延续
    output: '�AA',
  }, {
    input: 'GS8=', // [0x41, 0xC2] 2 字节头截断在末尾（延续字节缺失）
    output: 'A�',
  }, {
    input: 'v451', // [0xE4, 0x41, 0x41] 3 字节头 + 非法延续
    output: '�AA',
  }, {
    input: 'vBX1', // [0xE4, 0xB8, 0x41] 第二延续字节非法
    output: '��A',
  }, {
    input: 'vBW=', // [0xE4, 0xB8] 3 字节序列截断在末尾（第二延续字节缺失）
    output: '��',
  }].forEach((el) => {
    test(`${el.input} => ${JSON.stringify(el.output)}`, () => {
      expect(crypt.decode(el.input)).toBe(el.output);
    });
  });
});

describe('round-trip', () => {
  // 覆盖 1/2/3 字节 UTF-8 区段、代理对（CESU-8 式拆分）、控制字符（含 \r\n，不再归一化）
  ['中文©', '😀🎉', 'a\r\nb', 'a\\\'"?<>=-&_', ' '.repeat(100)].forEach((value) => {
    test(`${JSON.stringify(value)} 无损往返`, () => {
      expect(crypt.decode(crypt.encode(value))).toBe(value);
    });
  });
});
