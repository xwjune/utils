import treeUtil from '../index';

describe('数据转换', () => {
  const source = [
    { id: '330000', value: '浙江省', parentId: '100000' },
    { id: '330100', value: '杭州市', parentId: '330000' },
    { id: '330200', value: '宁波市', parentId: '330000' },
    { id: '320000', value: '江苏省', parentId: '100000' },
    { id: '320100', value: '南京市', parentId: '320000' },
    { id: '320200', value: '无锡市', parentId: '320000' },
  ];
  const attributes = {
    rootId: '100000',
    pId: 'parentId',
    name: 'value',
  };
  const result = [{
    id: '330000',
    name: '浙江省',
    children: [
      { id: '330100', name: '杭州市' },
      { id: '330200', name: '宁波市' },
    ],
  }, {
    id: '320000',
    name: '江苏省',
    children: [
      { id: '320100', name: '南京市' },
      { id: '320200', name: '无锡市' },
    ],
  }];
  test('dataConvert', () => {
    expect(treeUtil.dataConvert(source, attributes)).toEqual(result);
  });
  test('其他属性提取', () => {
    const s = [
      { id: '330000', name: '浙江省', py: 'zhejiang', parentId: '100000' },
      { id: '330100', name: '杭州市', py: 'hangzhou', parentId: '330000' },
      { id: '330200', name: '宁波市', py: 'ningbo', parentId: '330000' },
    ];
    const attr = {
      rootId: '100000',
      pId: 'parentId',
      otherKeys: ['py'],
    };
    const r = [{
      id: '330000',
      name: '浙江省',
      py: 'zhejiang',
      children: [
        { id: '330100', name: '杭州市', py: 'hangzhou' },
        { id: '330200', name: '宁波市', py: 'ningbo' },
      ],
    }];
    expect(treeUtil.dataConvert(s, attr)).toEqual(r);
  });
  test('空值输入', () => {
    expect(treeUtil.dataConvert()).toEqual([]);
  });
});

describe('数据提取', () => {
  const treeData = [{
    id: '330000',
    name: '浙江省',
    children: [
      { id: '330100', name: '杭州市' },
      { id: '330200', name: '宁波市' },
    ],
  }, {
    id: '320000',
    name: '江苏省',
    children: [
      { id: '320100', name: '南京市' },
      { id: '320200', name: '无锡市' },
    ],
  }];
  const attributes = {
    origin: 'name',
    key: 'id',
  };
  test('dataPick', () => {
    expect(treeUtil.dataPick(treeData, ['330000', '330100'])).toEqual(['浙江省', '杭州市']);
    expect(treeUtil.dataPick(treeData, ['浙江省', '杭州市'], attributes)).toEqual(['330000', '330100']);
    expect(treeUtil.dataPick(treeData, ['330000', '320200'])).toEqual(['浙江省']);
    expect(treeUtil.dataPick(treeData, ['340000'])).toEqual([]);
    expect(treeUtil.dataPick()).toEqual([]);
    expect(treeUtil.dataPick([])).toEqual([]);
  });
});

describe('数据查找', () => {
  const treeData = [{
    id: '330000',
    name: '浙江省',
    children: [
      { id: '330100', name: '杭州市' },
      { id: '330200', name: '宁波市' },
    ],
  }, {
    id: '320000',
    name: '江苏省',
    children: [
      { id: '320100', name: '南京市' },
      { id: '320200', name: '无锡市' },
    ],
  }];
  test('dataFind', () => {
    expect(treeUtil.dataFind(treeData, '330100')).toEqual({ id: '330100', name: '杭州市' });
    expect(treeUtil.dataFind(treeData, '330300')).toBeUndefined();
    expect(treeUtil.dataFind()).toBeUndefined();
  });
});
