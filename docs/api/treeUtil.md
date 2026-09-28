<!-- gen-docs: 此文件由 scripts/gen-docs.js 从 JSDoc 自动生成，勿手改；npm run docs:gen -->
# treeUtil
**树结构数据操作**

```JavaScript
import { treeUtil } from 'jun-utils';
```

## dataConvert(source, options)
**数据转换**

将具有层级关系的数组转化为树结构数组

注意：

- 输出顺序不保证跟随源数据顺序：主键为非负整数或其字符串形式（如 '330000'）
  的节点按数值升序在前，其余按源数据出现顺序在后，顶层与子集合均遵循此规则
- 非顶层数据的父主键值在源数据中无对应主键时，该数据将被丢弃
- 源数据存在重复主键时后者覆盖前者，并 console.warn 告警
- tId/tName 的值始终取映射结果，与之同名的透传属性（raw 或 otherKeys）会被映射值覆盖

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| source | 源数据【有层级关系】 | Object[] | - |
| options | 配置参数 | Object | - |
| options.pId | 源数据父主键 key | string | - |
| options.rootId | 源数据根节点主键值，将父主键值与之相等的数据视为顶层树节点 【缺省此参数，将父主键值为 undefined/null 的数据视为顶层树节点】 | string | - |
| options.id | 源数据主键 key | string | 'id' |
| options.name | 源数据名称 key | string | 'name' |
| options.tId | 树节点主键 key | string | 'id' |
| options.tName | 树节点名称 key | string | 'name' |
| options.children | 树节点子集合 key | string | 'children' |
| options.raw | 是否保留所有属性 | boolean | false |
| options.otherKeys | 其他需要保留的属性【raw=true 时无效】 | string[] | [] |

**Throws**

- `TypeError` — options.pId 缺失或不是非空字符串

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
// 输出结果
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
}]
```

## dataPick(treeData, values, [options])
**数据提取**

根据某一属性的值提取出另一属性的值。  
路径中途失配时返回已命中的部分结果

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| treeData | 源数据 | Object[] | - |
| values | 原始值 | string[] | - |
| options | 配置参数 | Object | - |
| options.origin | 原始 key | string | 'id' |
| options.key | 提取 key | string | 'name' |
| options.children | 子集合 key | string | 'children' |

```JavaScript
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

treeUtil.dataPick(treeData, ['330000', '330100']);
// => ['浙江省', '杭州市']
```

## dataFind(treeData, value, [options])
**数据查找**

### API
| Property | Description | Type | Default |
| :------- | :---------- | :--- | :------ |
| treeData | 源数据 | Object[] | - |
| value | 属性值 | string | - |
| options | 配置参数 | Object | - |
| options.key | key | string | 'id' |
| options.children | 子集合 key | string | 'children' |

```JavaScript
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

treeUtil.dataFind(treeData, '330100');
// => { id: '330100', name: '杭州市' }
```

---

[← 返回 API 索引](../../README.md#api)
