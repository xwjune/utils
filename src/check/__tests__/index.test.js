import check from '../index';

describe('手机校验', () => {
  test('13456789012', () => {
    expect(check.cellphone('13456789012')).toBeTruthy();
  });
  test('123456789', () => {
    expect(check.cellphone('123456789')).toBeFalsy();
  });
});

describe('固定电话校验', () => {
  [
    '0571-85735888',
    '057185735888',
    '85735888',
  ].forEach((el) => {
    test(el, () => {
      expect(check.telphone(el)).toBeTruthy();
    });
  });
});

describe('电话【手机和固定电话】校验', () => {
  [
    '057185735888',
    '13456789012',
  ].forEach((el) => {
    test(el, () => {
      expect(check.phone(el)).toBeTruthy();
    });
  });
});

describe('邮箱校验', () => {
  [
    'test@163.com',
    'te_st@sima.vip.com',
  ].forEach((el) => {
    test(el, () => {
      expect(check.email(el)).toBeTruthy();
    });
  });
});

describe('邮编校验', () => {
  test('310000', () => {
    expect(check.postcode('310000')).toBeTruthy();
  });
  test('3100000', () => {
    expect(check.postcode('3100000')).toBeFalsy();
  });
});

describe('空校验', () => {
  test('correct', () => {
    expect(check.isNull()).toBeTruthy();
    expect(check.isNull(undefined)).toBeTruthy();
    expect(check.isNull(null)).toBeTruthy();
    expect(check.isNull('')).toBeTruthy();
    expect(check.isNull('null')).toBeFalsy();
    expect(check.isNull('undefined')).toBeFalsy();
  });
});

describe('数字校验', () => {
  test('error', () => {
    ['', undefined, null, 'null', '.2', '-.2'].forEach((el) => {
      expect(check.isNumber(el)).toBeFalsy();
    });
    expect(check.isNumber()).toBeFalsy();
  });
  test('correct', () => {
    ['20', '-20', '+20', '0.2', '-0'].forEach((el) => {
      expect(check.isNumber(el)).toBeTruthy();
    });
  });
  test('.2【number】', () => {
    expect(check.isNumber(.2)).toBeTruthy(); // eslint-disable-line no-floating-decimal
  });
  test('.2【string】', () => {
    expect(check.isNumber('.2')).toBeFalsy();
  });
  test('科学计数法数字', () => {
    expect(check.isNumber(1e+21)).toBeTruthy();
    expect(check.isNumber('1e+21')).toBeTruthy();
  });
  test('非有限数字', () => {
    [NaN, Infinity, -Infinity, 'Infinity', '-Infinity', '1e999'].forEach((el) => {
      expect(check.isNumber(el)).toBeFalsy();
    });
  });
  test('非法数字字符串', () => {
    ['+.2', ' ', ' 20 ', '0x10', '0b101', '0o17', '00.2', '020', '1.', '1e'].forEach((el) => {
      expect(check.isNumber(el)).toBeFalsy();
    });
  });
});

describe('十进制数字校验', () => {
  test('correct', () => {
    ['20', '-20', '0.2', '-20.5', 20.5, 0].forEach((el) => {
      expect(check.isDecimalNumber(el)).toBeTruthy();
    });
  });
  test('error', () => {
    ['', undefined, null, 'null', '.2', '-.2', '020', ' 20 ', '+20'].forEach((el) => {
      expect(check.isDecimalNumber(el)).toBeFalsy();
    });
    expect(check.isDecimalNumber()).toBeFalsy();
  });
  test('不兼容科学计数法', () => {
    ['1e3', '1e+21', '1E-7'].forEach((el) => {
      expect(check.isDecimalNumber(el)).toBeFalsy();
    });
    // String(1e+21) => '1e+21'、String(1e-7) => '1e-7'
    expect(check.isDecimalNumber(1e+21)).toBeFalsy();
    expect(check.isDecimalNumber(1e-7)).toBeFalsy();
  });
  test('超出双精度表示范围', () => {
    // Number('1' + '0'.repeat(400)) => Infinity
    expect(check.isDecimalNumber(`1${'0'.repeat(400)}`)).toBeFalsy();
  });
  test('非字符串/数字类型不做隐式转换', () => {
    // String([20]) => '20' 会误匹配正则，需显式拦截
    // eslint-disable-next-line no-new-wrappers
    [[20], [['20']], new Number(20), { toString: () => '20' }, true].forEach((el) => {
      expect(check.isDecimalNumber(el)).toBeFalsy();
    });
  });
});

describe('整数校验', () => {
  ['20', '-20'].forEach((el) => {
    test(el, () => {
      expect(check.isInteger(el)).toBeTruthy();
    });
  });
  ['0.2', '020'].forEach((el) => {
    test(el, () => {
      expect(check.isInteger(el)).toBeFalsy();
    });
  });
  test('数字入参', () => {
    [20, -20, 0].forEach((el) => {
      expect(check.isInteger(el)).toBeTruthy();
    });
    [0.2, NaN, Infinity, 1e21].forEach((el) => {
      expect(check.isInteger(el)).toBeFalsy();
    });
  });
  test('非字符串/数字类型不做隐式转换', () => {
    // eslint-disable-next-line no-new-wrappers
    [[20], [['20']], new Number(20), { toString: () => '20' }, true].forEach((el) => {
      expect(check.isInteger(el)).toBeFalsy();
    });
    expect(check.isInteger()).toBeFalsy();
  });
  test('超出双精度表示范围', () => {
    // Number('1' + '0'.repeat(400)) => Infinity
    expect(check.isInteger(`1${'0'.repeat(400)}`)).toBeFalsy();
  });
});

describe('小数校验', () => {
  ['0.2', '-0.2'].forEach((el) => {
    test(el, () => {
      expect(check.isDecimal(el)).toBeTruthy();
    });
  });
  ['20', '00.2'].forEach((el) => {
    test(el, () => {
      expect(check.isDecimal(el)).toBeFalsy();
    });
  });
  test('数字入参', () => {
    [0.2, -0.2].forEach((el) => {
      expect(check.isDecimal(el)).toBeTruthy();
    });
    [20, NaN, Infinity, 1e-7].forEach((el) => {
      expect(check.isDecimal(el)).toBeFalsy();
    });
  });
  test('非字符串/数字类型不做隐式转换', () => {
    // eslint-disable-next-line no-new-wrappers
    [[0.2], [['0.2']], new Number(0.2), new String('0.2'), { toString: () => '0.2' }, true].forEach((el) => {
      expect(check.isDecimal(el)).toBeFalsy();
    });
    expect(check.isDecimal()).toBeFalsy();
  });
  test('超出双精度表示范围', () => {
    // Number('1' + '0'.repeat(400) + '.5') => Infinity
    expect(check.isDecimal(`1${'0'.repeat(400)}.5`)).toBeFalsy();
  });
});

describe('金额【元】判断', () => {
  ['20', '20.00'].forEach((el) => {
    test(el, () => {
      expect(check.money(el)).toBeTruthy();
    });
  });
  ['20.002', '002', '-20'].forEach((el) => {
    test(el, () => {
      expect(check.money(el)).toBeFalsy();
    });
  });
});

describe('中文判断', () => {
  [
    '中文', // 基本区汉字
    '。', // CJK 符号和标点
    '，', // 全角标点
    '￥', // 全角货币符
    '鿕', // U+9FD5，Unicode 增补进基本区的汉字
    '𠮷', // 扩展 B 代理对（人名用字）
    '㎡', // CJK 兼容单位符号
  ].forEach((el) => {
    test(el, () => {
      expect(check.hasChinese(el)).toBeTruthy();
    });
  });
  [
    'chinese',
    'ＡＢＣ', // 全角字母不算中文
    '１２３', // 全角数字不算中文
    '—…', // 中西共用标点不算中文
    '“”‘’', // 弯引号不算中文
    'l’étude', // 西文弯撇号
    '￢', // U+FFE2 全角逻辑非，全角西文符号不算中文
    'ｱ', // 半角片假名
  ].forEach((el) => {
    test(el, () => {
      expect(check.hasChinese(el)).toBeFalsy();
    });
  });
  test('零宽空格 U+200B', () => {
    // 用码点构造，避免源码里混入不可见字符
    expect(check.hasChinese(String.fromCharCode(0x200b))).toBeFalsy();
  });
  test('非字符串', () => {
    expect(check.hasChinese()).toBeFalsy();
    expect(check.hasChinese(null)).toBeFalsy();
    expect(check.hasChinese(123)).toBeFalsy();
    // 数组不再被隐式转成 "中,文"
    expect(check.hasChinese(['中', '文'])).toBeFalsy();
    // Symbol 不再抛 TypeError
    expect(check.hasChinese(Symbol('s'))).toBeFalsy();
  });
});

describe('身份证校验', () => {
  [
    '330000199001017865', // 二代，校验码 5
    '33000019900101746X', // 二代，校验码 X
    '33000019900101746x', // 校验码 X 不区分大小写
    '330000200002291239', // 闰年 2 月 29 日
    '330000900101786', // 一代（15 位）
  ].forEach((el) => {
    test(el, () => {
      expect(check.idCard(el)).toBeTruthy();
    });
  });
  [
    '330000199001017866', // 校验码打错（应为 5）
    '33000019900101786X', // 格式对但校验码错，不再放行
    '330000199013017865', // 13 月
    '330000199002311230', // 2 月 31 日
    '33000019000229123X', // 平年（1900）2 月 29 日
    '330000900231786', // 一代 2 月 31 日
    '33000019900101785', // 17 位
    ' 330000199001017865', // 前置空格
  ].forEach((el) => {
    test(el, () => {
      expect(check.idCard(el)).toBeFalsy();
    });
  });
  test('非字符串', () => {
    [null, undefined, 123, ['330000199001017865']].forEach((el) => {
      expect(check.idCard(el)).toBeFalsy();
    });
  });
});

describe('ip地址校验', () => {
  [
    '192.168.0.1',
    '127.0.0.1',
    '0.0.0.0',
    '255.255.255.255',
  ].forEach((el) => {
    test(el, () => {
      expect(check.ip(el)).toBeTruthy();
    });
  });
  [
    '127.256.27.1',
    '01.1.1.1',
    '1.1.1',
    '1.1.1.1.',
  ].forEach((el) => {
    test(el, () => {
      expect(check.ip(el)).toBeFalsy();
    });
  });
  test('非字符串【单元素数组隐式转换】', () => {
    expect(check.ip(['192.168.0.1'])).toBeFalsy();
    expect(check.ip(null)).toBeFalsy();
  });
});

describe('支付宝账号校验', () => {
  [
    'test@163.com',
    '13456789012',
  ].forEach((el) => {
    test(el, () => {
      expect(check.alipay(el)).toBeTruthy();
    });
  });
});

describe('弱密码校验', () => {
  [
    '',
    '123',
    '123456',
    '111111111111111111111111111111111',
    // 长度合法但四种元素均未命中，rule 为 0
    '中文密码测试',
  ].forEach((el) => {
    test(el, () => {
      expect(check.pwdIntensity(el)).toBe(1);
    });
  });
  // 含空白字符（空格、制表符、全角空格等）直接判弱，不再参与元素计数
  [
    '      ',
    'abcdef ',
    ' abc123ABC',
    'abc123\t',
    'abc123　',
  ].forEach((el) => {
    test(JSON.stringify(el), () => {
      expect(check.pwdIntensity(el)).toBe(1);
    });
  });
  // 非字符串不得绕过长度校验后被正则隐式转换
  test('1e+21（数字类型）', () => {
    expect(check.pwdIntensity(1e21)).toBe(1);
  });
  test('数组类型', () => {
    expect(check.pwdIntensity(['a', 1, '@', 'x', 'y', 'z'])).toBe(1);
  });
  // 代理对按 1 个字符计，不能按 2 位充最短位数
  test('😀😀a1（实际 4 位）', () => {
    expect(check.pwdIntensity('😀😀a1')).toBe(1);
  });
  [
    '123456abc',
    '123456ABC',
    'abcABC',
    '123456@',
  ].forEach((el) => {
    test(el, () => {
      expect(check.pwdIntensity(el)).toBe(2);
    });
  });
  [
    '123456abcABC',
    '123456abcABC@',
  ].forEach((el) => {
    test(el, () => {
      expect(check.pwdIntensity(el)).toBe(3);
    });
  });

  describe('非法字符校验', () => {
    [
      '123\n123',
      '123\\123',
      '123\t123',
      '123\v123',
      '123"123',
    ].forEach((el) => {
      test(el, () => {
        expect(check.illegalChar(el)).toBeTruthy();
      });
    });
    test('123', () => {
      expect(check.illegalChar('123')).toBeFalsy();
    });
  });
});
