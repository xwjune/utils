import treeUtil from '../index';

const source = [
  { id: '330000', value: '浙江省', parentId: '100000', py: 'zhejiang' },
  { id: '330100', value: '杭州市', parentId: '330000', py: 'hangzhou' },
  { id: '330106', value: '西湖区', parentId: '330100', py: 'xihu' },
  { id: '330200', value: '宁波市', parentId: '330000', py: 'ningbo' },
  { id: '320000', value: '江苏省', parentId: '100000', py: 'jiangsu' },
  { id: '320100', value: '南京市', parentId: '320000', py: 'nanjing' },
  { id: '320200', value: '无锡市', parentId: '320000', py: 'wuxi' },
];
const source2 = [
  { id: '330000', value: '浙江省', py: 'zhejiang' },
  { id: '330100', value: '杭州市', parentId: '330000', py: 'hangzhou' },
  { id: '330106', value: '西湖区', parentId: '330100', py: 'xihu' },
  { id: '330200', value: '宁波市', parentId: '330000', py: 'ningbo' },
  { id: '320000', value: '江苏省', py: 'jiangsu' },
  { id: '320100', value: '南京市', parentId: '320000', py: 'nanjing' },
  { id: '320200', value: '无锡市', parentId: '320000', py: 'wuxi' },
];
const result = [{
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ],
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市', children: [{ id: '330106', name: '西湖区' }] },
    { id: '330200', name: '宁波市' },
  ],
}];
const result2 = [{
  id: '320000',
  name: '江苏省',
  py: 'jiangsu',
  children: [
    { id: '320100', name: '南京市', py: 'nanjing' },
    { id: '320200', name: '无锡市', py: 'wuxi' },
  ],
}, {
  id: '330000',
  name: '浙江省',
  py: 'zhejiang',
  children: [
    {
      id: '330100',
      name: '杭州市',
      py: 'hangzhou',
      children: [{ id: '330106', name: '西湖区', py: 'xihu' }],
    },
    { id: '330200', name: '宁波市', py: 'ningbo' },
  ],
}];
const result3 = [{
  id: '320000',
  value: '江苏省',
  parentId: '100000',
  py: 'jiangsu',
  children: [
    { id: '320100', value: '南京市', parentId: '320000', py: 'nanjing' },
    { id: '320200', value: '无锡市', parentId: '320000', py: 'wuxi' },
  ],
}, {
  id: '330000',
  value: '浙江省',
  parentId: '100000',
  py: 'zhejiang',
  children: [
    {
      id: '330100',
      value: '杭州市',
      parentId: '330000',
      py: 'hangzhou',
      children: [{ id: '330106', value: '西湖区', parentId: '330100', py: 'xihu' }],
    },
    { id: '330200', value: '宁波市', parentId: '330000', py: 'ningbo' },
  ],
}];

describe('数据转换', () => {
  test('dataConvert', () => {
    expect(treeUtil.dataConvert(source, {
      rootId: '100000',
      pId: 'parentId',
      name: 'value',
    })).toEqual(result);
  });
  test('dataConvert-2', () => {
    expect(treeUtil.dataConvert(source2, {
      // rootId: undefined,
      pId: 'parentId',
      name: 'value',
    })).toEqual(result);
  });
  test('其他属性提取', () => {
    expect(treeUtil.dataConvert(source, {
      rootId: '100000',
      pId: 'parentId',
      name: 'value',
      otherKeys: ['py'],
    })).toEqual(result2);
  });
  test('其他属性提取-2', () => {
    expect(treeUtil.dataConvert(source, {
      rootId: '100000',
      pId: 'parentId',
      name: 'value',
      tName: 'value',
      otherKeys: ['py', 'parentId'],
    })).toEqual(result3);
  });
  test('其他属性提取-3', () => {
    expect(treeUtil.dataConvert(source, {
      rootId: '100000',
      pId: 'parentId',
      name: 'value',
      tName: 'value',
      raw: true,
    })).toEqual(result3);
  });
  test('其他属性提取-4', () => {
    expect(treeUtil.dataConvert(source, {
      rootId: '100000',
      pId: 'parentId',
      name: 'value',
      tName: 'value',
      raw: true,
      otherKeys: ['py'],
    })).toEqual(result3);
  });
  test('空值输入', () => {
    expect(treeUtil.dataConvert()).toEqual([]);
  });
});

describe('数据提取', () => {
  const treeData = [{
    id: '320000',
    name: '江苏省',
    children: [
      { id: '320100', name: '南京市' },
      { id: '320200', name: '无锡市' },
    ],
  }, {
    id: '330000',
    name: '浙江省',
    children: [
      { id: '330100', name: '杭州市' },
      { id: '330200', name: '宁波市' },
    ],
  }];
  const options = {
    origin: 'name',
    key: 'id',
  };
  test('dataPick', () => {
    expect(treeUtil.dataPick(treeData, ['330000', '330100'])).toEqual(['浙江省', '杭州市']);
    expect(treeUtil.dataPick(treeData, ['浙江省', '杭州市'], options)).toEqual(['330000', '330100']);
    expect(treeUtil.dataPick(treeData, ['330000', '320200'])).toEqual(['浙江省']);
    expect(treeUtil.dataPick(treeData, ['340000'])).toEqual([]);
    expect(treeUtil.dataPick()).toEqual([]);
    expect(treeUtil.dataPick([])).toEqual([]);
  });
});

describe('数据查找', () => {
  const treeData = [{
    id: '320000',
    name: '江苏省',
    children: [
      { id: '320100', name: '南京市' },
      { id: '320200', name: '无锡市' },
    ],
  }, {
    id: '330000',
    name: '浙江省',
    children: [
      { id: '330100', name: '杭州市' },
      { id: '330200', name: '宁波市' },
    ],
  }];
  test('dataFind', () => {
    expect(treeUtil.dataFind(treeData, '330100')).toEqual({ id: '330100', name: '杭州市' });
    expect(treeUtil.dataFind(treeData, '330300')).toBeUndefined();
    expect(treeUtil.dataFind()).toBeUndefined();
  });
});
