/**
 * 树结构数据操作
 */

/**
 * 数据转换
 * 将具有层级关系的数组转化为树结构数组
 *
 * @param {Object[]} source - 源数据【有层级关系】
 * @param {Object} attributes - 配置参数
 * @param {String} attributes.pId - 源数据父主键key
 * @param {String} [attributes.rootId] - 源数据根节点主键值，将父主键值与之相等的数据视为顶层树节点【缺省此参数，将没有父主键的数据视为顶层树节点】
 * @param {String} [attributes.id='id'] - 源数据主键key
 * @param {String} [attributes.name='name'] - 源数据名称key
 * @param {String} [attributes.tId='id'] - 树节点主键key
 * @param {String} [attributes.tName='name'] - 树节点名称key
 * @param {String} [attributes.children='children'] - 子集合key
 * @param {Array} [attributes.otherKeys=[]] - 其他key【将转化为树节点属性】
 * @param {Function} [attributes.onParse] - 源数据解析回调
 * @return {Object[]} 树结构数据
 * @example
 *
 * const source = [
 *   { id: '330000', value: '浙江省', parentId: '100000' },
 *   { id: '330100', value: '杭州市', parentId: '330000' },
 *   { id: '330200', value: '宁波市', parentId: '330000' },
 *   { id: '320000', value: '江苏省', parentId: '100000' },
 *   { id: '320100', value: '南京市', parentId: '320000' },
 *   { id: '320200', value: '无锡市', parentId: '320000' },
 * ];
 * const attributes = { rootId: '100000', pId: 'parentId', name: 'value' };
 *
 * dataConvert(source, attributes);
 * // => [{
 *   id: '330000',
 *   name: '浙江省',
 *   children: [
 *     { id: '330100', name: '杭州市' },
 *     { id: '330200', name: '宁波市' },
 *   ]
 * }, {
 *   id: '320000',
 *   name: '江苏省',
 *   children: [
 *     { id: '320100', name: '南京市' },
 *     { id: '320200', name: '无锡市' },
 *   ]
 * }]
 */
function dataConvert(source = [], attributes = {}) {
  const {
    rootId, // 源数据根节点主键值
    pId, // 源数据父主键key
    id = 'id', // 源数据主键key
    name = 'name', // 源数据名称key
    tId = 'id', // 树节点主键key
    tName = 'name', // 树节点名称key
    children = 'children', // 子集合key
    otherKeys = [], // 其他属性
    onParse, // 源数据解析回调
  } = attributes;
  const restData = [...source]; // 源数据
  const treeData = []; // 树结构数据

  // 根节点解析
  for (let i = 0, iLen = restData.length; i < iLen; i++) {
    if (onParse && typeof onParse === 'function') {
      onParse(restData[i]);
    }
    if (restData[i][pId] === rootId) {
      const node = {
        [tId]: restData[i][id],
        [tName]: restData[i][name],
      };
      otherKeys.forEach((key) => {
        Object.assign(node, {
          [key]: restData[i][key],
        });
      });
      treeData.push(node);
      restData.splice(i, 1);
      iLen -= 1;
      i -= 1;
    }
  }

  // 子节点解析
  const pickChild = (node) => {
    if (restData.length !== 0) {
      for (let i = 0, iLen = node.length; i < iLen; i++) {
        for (let j = 0, jLen = restData.length; j < jLen; j++) {
          if (node[i][tId] === restData[j][pId]) {
            if (!node[i][children]) {
              Object.assign(node[i], {
                [children]: [],
              });
            }
            const child = {
              [tId]: restData[j][id],
              [tName]: restData[j][name],
            };
            otherKeys.forEach((key) => {
              Object.assign(child, {
                [key]: restData[j][key],
              });
            });
            node[i][children].push(child);
            restData.splice(j, 1);
            jLen -= 1;
            j -= 1;
          }
        }
        if (node[i][children]) {
          pickChild(node[i][children]);
        }
      }
    }
  };

  pickChild(treeData);

  return treeData;
}

/**
 * 数据提取
 * 根据某一属性的值提取出另一属性的值
 *
 * @param {Object[]} treeData - 源数据
 * @param {Array} values - 原始值
 * @param {Object} [attributes] - 配置参数
 * @param {String} [attributes.origin='id'] - 原始key
 * @param {String} [attributes.key='name'] - 提取key
 * @param {String} [attributes.children='children'] - 子集合key
 * @return {Array} 提取的数据
 * @example
 *
 * const treeData = [{
 *   id: '330000',
 *   name: '浙江省',
 *   children: [
 *     { id: '330100', name: '杭州市' },
 *     { id: '330200', name: '宁波市' },
 *   ],
 * }, {
 *   id: '320000',
 *   name: '江苏省',
 *   children: [
 *     { id: '320100', name: '南京市' },
 *     { id: '320200', name: '无锡市' },
 *   ],
 * }];
 *
 * dataPick(treeData, ['330000', '330100']);
 * // => ['浙江省', '杭州市']
 */
function dataPick(treeData = [], values = [], attributes = {}) {
  const {
    origin = 'id', // 原始key
    key = 'name', // 提取key
    children = 'children', // 子集合key
  } = attributes;
  const newValues = [];
  const pick = (source = [], index = 0) => {
    source.some((item) => {
      if (item[origin] === values[index]) {
        newValues.push(item[key]);
        if (item[children]) {
          pick(item[children], index + 1);
        }
        return true;
      }
      return false;
    });
  };

  pick(treeData);

  return newValues;
}

/**
 * 判断数据是否存在
 *
 * @param {Object[]} treeData - 源数据
 * @param {String} value - 属性值
 * @param {Object} [attributes] - 配置参数
 * @param {String} [attributes.key='id'] - key
 * @param {String} [attributes.children='children'] - 子集合key
 * @return {Boolean} 是-存在，false-不存在
 * @example
 *
 * const treeData = [{
 *   id: '330000',
 *   name: '浙江省',
 *   children: [
 *     { id: '330100', name: '杭州市' },
 *     { id: '330200', name: '宁波市' },
 *   ],
 * }, {
 *   id: '320000',
 *   name: '江苏省',
 *   children: [
 *     { id: '320100', name: '南京市' },
 *     { id: '320200', name: '无锡市' },
 *   ],
 * }];
 *
 * dataMatch(treeData, '杭州市', { key: 'name' });
 * // => true
 */
function dataMatch(treeData = [], value, attributes = {}) {
  const {
    key = 'id', // key
    children = 'children', // 子集合key
  } = attributes;
  const find = (data) => {
    return data.some((item) => {
      if (item[key] === value) {
        return true;
      }
      if (item[children]) {
        return find(item[children]);
      }
      return false;
    });
  };

  return find(treeData);
}

export default {
  dataConvert,
  dataPick,
  dataMatch,
};
