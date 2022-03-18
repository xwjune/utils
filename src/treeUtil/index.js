/**
 * 树结构数据操作
 *
 * dataConvert - 数据转换
 * dataPick - 数据提取
 * dataFind - 数据查找
 */

/**
 * 数据转换
 * 将具有层级关系的数组转化为树结构数组
 *
 * @param {Object[]} source - 源数据【有层级关系】
 * @param {Object} options - 配置参数
 * @param {String} options.pId - 源数据父主键key
 * @param {String} [options.rootId] - 源数据根节点主键值，将父主键值与之相等的数据视为顶层树节点【缺省此参数，将没有父主键的数据视为顶层树节点】
 * @param {String} [options.id='id'] - 源数据主键key
 * @param {String} [options.name='name'] - 源数据名称key
 * @param {String} [options.tId='id'] - 树节点主键key
 * @param {String} [options.tName='name'] - 树节点名称key
 * @param {String} [options.children='children'] - 树节点子集合key
 * @param {Boolean} [options.raw=false] - 是否保留所有属性
 * @param {Array} [options.otherKeys=[]] - 其他需要保留的属性【raw=true时无效】
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
 * const options = { rootId: '100000', pId: 'parentId', name: 'value' };
 *
 * dataConvert(source, options);
 * // => [{
 *   id: '320000',
 *   name: '江苏省',
 *   children: [
 *     { id: '320100', name: '南京市' },
 *     { id: '320200', name: '无锡市' },
 *   ]
 * }, {
 *   id: '330000',
 *   name: '浙江省',
 *   children: [
 *     { id: '330100', name: '杭州市' },
 *     { id: '330200', name: '宁波市' },
 *   ]
 * }]
 */
function dataConvert(source = [], options = {}) {
  const {
    rootId, // 源数据根节点主键值
    pId, // 源数据父主键key
    id = 'id', // 源数据主键key
    name = 'name', // 源数据名称key
    tId = 'id', // 树节点主键key
    tName = 'name', // 树节点名称key
    children = 'children', // 树节点子集合key
    raw = false, // 是否保留所有属性
    otherKeys = [], // 其他需要保留的属性
  } = options;
  const dataObj = {}; // 缓存数据
  const delPid = !raw && !otherKeys.includes(pId); // 是否删除数据父主键key

  // 缓存数据
  source.forEach((item) => {
    const obj = {
      [tId]: item[id],
      [tName]: item[name],
      [pId]: item[pId],
    };
    if (raw) {
      Object.assign(obj, { ...item });
    } else {
      otherKeys.forEach((key) => {
        Object.assign(obj, {
          [key]: item[key],
        });
      });
    }
    dataObj[item[id]] = obj;
  });

  return Object.values(dataObj).filter((item) => {
    if (item[pId] !== rootId) {
      // 非根节点子节点集合
      if (dataObj[item[pId]]) {
        // 父节点是否为有效值
        if (!dataObj[item[pId]][children]) {
          dataObj[item[pId]][children] = [];
        }
        dataObj[item[pId]][children].push(item);
        if (delPid) {
          delete item[pId];
        }
      }
      return false;
    }
    // 根节点子节点集合
    if (delPid) {
      delete item[pId];
    }
    return true;
  });
}

/**
 * 数据提取
 * 根据某一属性的值提取出另一属性的值
 *
 * @param {Object[]} treeData - 源数据
 * @param {Array} values - 原始值
 * @param {Object} [options] - 配置参数
 * @param {String} [options.origin='id'] - 原始key
 * @param {String} [options.key='name'] - 提取key
 * @param {String} [options.children='children'] - 子集合key
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
function dataPick(treeData = [], values = [], options = {}) {
  const {
    origin = 'id', // 原始key
    key = 'name', // 提取key
    children = 'children', // 子集合key
  } = options;
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
 * 数据查找
 *
 * @param {Object[]} treeData - 源数据
 * @param {String} value - 属性值
 * @param {Object} [options] - 配置参数
 * @param {String} [options.key='id'] - key
 * @param {String} [options.children='children'] - 子集合key
 * @return {Object|undefined}
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
 * dataFind(treeData, '330100');
 * // => { id: '330100', name: '杭州市' }
 */
function dataFind(treeData = [], value, options = {}) {
  const {
    key = 'id', // key
    children = 'children', // 子集合key
  } = options;
  let result;
  const find = (data) => {
    return data.find((item) => {
      if (item[key] === value) {
        result = {
          ...item,
        };
        return true;
      }
      if (item[children] && item[children].length > 0) {
        return find(item[children]);
      }
      return false;
    });
  };
  find(treeData);

  return result;
}

export default {
  dataConvert,
  dataPick,
  dataFind,
};
