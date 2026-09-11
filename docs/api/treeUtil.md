# treeUtil
**树结构数据操作**

```JavaScript
import { treeUtil } from 'jun-utils';
```

## dataConvert(source, options)
数据转换

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| source | 源数据 | object[] | [] |
| options | 配置参数 | object | {} |
| options.pId | 源数据父主键key | string  | - |
| options.rootId | 源数据根节点主键值；缺省时父主键值为 undefined/null 的数据视为顶层节点 | string | - |
| options.id | 源数据主键key | string | id |
| options.name | 源数据名称key | string | name |
| options.tId | 树节点主键key | string | id |
| options.tName | 树节点名称key | string | name |
| options.children | 树节点子集合key | string | children |
| options.raw | 是否保留所有属性 | boolean | false |
| options.otherKeys | 其他需要保留的属性 | array | [] |

```JavaScript
const source = [
  { id: '330000', value: '浙江省', parentId: '100000' },
  { id: '330100', value: '杭州市', parentId: '330000' },
  { id: '330200', value: '宁波市', parentId: '330000' },
  { id: '320000', value: '江苏省', parentId: '100000' },
  { id: '320100', value: '南京市', parentId: '320000' },
  { id: '320200', value: '无锡市', parentId: '320000' },
];
const options = { rootId: '100000', pId: 'parentId', name: 'value' };
treeUtil.dataConvert(source, options);
// => 
[{ 
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}];
```

## dataPick(treeData, values, [options])
数据提取

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| treeData | 源数据 | object[] | [] |
| values | 原始值 | array | - |
| options | 配置参数 | object | {} |
| options.origin | 原始key | string  | id |
| options.key | 提取key | string  | name |
| options.children | 子集合key | string | children |

```JavaScript
const treeData = [{
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}];
treeUtil.dataPick(treeData, ['330000', '330100']); // ['浙江省', '杭州市']
```

## dataFind(treeData, value, [options])
数据查找

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| treeData | 源数据 | object[] | [] |
| value | 属性值 | string | - |
| options | 配置参数 | object | {} |
| options.key | key | string  | id |
| options.children | 子集合key | string | children |

```JavaScript
const treeData = [{
  id: '320000',
  name: '江苏省',
  children: [
    { id: '320100', name: '南京市' },
    { id: '320200', name: '无锡市' },
  ]
}, {
  id: '330000',
  name: '浙江省',
  children: [
    { id: '330100', name: '杭州市' },
    { id: '330200', name: '宁波市' },
  ]
}];
treeUtil.dataFind(treeData, '330100'); // { id: '330100', name: '杭州市' }
```

---

[← 返回 API 索引](../../README.md#api)
