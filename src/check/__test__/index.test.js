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
  test('isNull()', () => {
    expect(check.isNull()).toBeTruthy();
  });
  test("isNull('null', ['null', '(null)'])", () => {
    expect(check.isNull('null', ['null', '(null)'])).toBeTruthy();
  });
});

describe('数字校验', () => {
  ['20', '-20', '0.2'].forEach((el) => {
    test(el, () => {
      expect(check.isNumber(el)).toBeTruthy();
    });
  });
  test('isNumber(.2)', () => {
    expect(check.isNumber(.2)).toBeTruthy(); // eslint-disable-line no-floating-decimal
  });
  test("isNumber('.2')", () => {
    expect(check.isNumber('.2')).toBeFalsy();
  });
  test('9.007199254740992e+21', () => {
    expect(check.isNumber(9.007199254740992e+21)).toBeTruthy();
  });
  test('isNumber(9.007199254740992e+21, false)', () => {
    expect(check.isNumber(9.007199254740992e+21, false)).toBeFalsy();
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
});

describe('金额【元】判断', () => {
  ['-20', '20.00'].forEach((el) => {
    test(el, () => {
      expect(check.money(el)).toBeTruthy();
    });
  });
  ['20.002', '002'].forEach((el) => {
    test(el, () => {
      expect(check.money(el)).toBeFalsy();
    });
  });
});

describe('中文判断', () => {
  ['中文', '。'].forEach((el) => {
    test(el, () => {
      expect(check.hasChinese(el)).toBeTruthy();
    });
  });
  test('chinese', () => {
    expect(check.hasChinese('chinese')).toBeFalsy();
  });
});

describe('身份证校验', () => {
  [
    '330000199001017865',
    '33000019900101786X',
    '330000900101786',
  ].forEach((el) => {
    test(el, () => {
      expect(check.idCard(el)).toBeTruthy();
    });
  });
  test('330000199013017865', () => {
    expect(check.idCard('330000199013017865')).toBeFalsy();
  });
});

describe('ip地址校验', () => {
  [
    '192.168.0.1',
    '127.0.0.1',
  ].forEach((el) => {
    test(el, () => {
      expect(check.ip(el)).toBeTruthy();
    });
  });
  test('127.256.27.1', () => {
    expect(check.ip('127.256.27.1')).toBeFalsy();
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
  ].forEach((el) => {
    test(el, () => {
      expect(check.pwdIntensity(el)).toBe(1);
    });
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
});
