'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = function () {
  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var rootId = attributes.rootId,
      pId = attributes.pId,
      _attributes$id = attributes.id,
      id = _attributes$id === undefined ? 'id' : _attributes$id,
      _attributes$name = attributes.name,
      name = _attributes$name === undefined ? 'name' : _attributes$name,
      _attributes$tId = attributes.tId,
      tId = _attributes$tId === undefined ? 'id' : _attributes$tId,
      _attributes$tName = attributes.tName,
      tName = _attributes$tName === undefined ? 'name' : _attributes$tName,
      _attributes$children = attributes.children,
      children = _attributes$children === undefined ? 'children' : _attributes$children,
      _attributes$otherKeys = attributes.otherKeys,
      otherKeys = _attributes$otherKeys === undefined ? [] : _attributes$otherKeys;

  var restData = [].concat((0, _toConsumableArray3.default)(source)); // 源数据
  var treeData = []; // 树结构数据

  // 根节点解析

  var _loop = function _loop(_i, _iLen) {
    if (restData[_i][pId] === rootId) {
      var _node;

      var node = (_node = {}, (0, _defineProperty3.default)(_node, tId, restData[_i][id]), (0, _defineProperty3.default)(_node, tName, restData[_i][name]), _node);
      otherKeys.forEach(function (key) {
        (0, _assign2.default)(node, (0, _defineProperty3.default)({}, key, restData[_i][key]));
      });
      treeData.push(node);
      restData.splice(_i, 1);
      _iLen -= 1;
      _i -= 1;
    }
    i = _i;
    iLen = _iLen;
  };

  for (var i = 0, iLen = restData.length; i < iLen; i++) {
    _loop(i, iLen);
  }

  // 子节点解析
  var pickChild = function pickChild(node) {
    if (restData.length !== 0) {
      for (var i = 0, iLen = node.length; i < iLen; i++) {
        var _loop2 = function _loop2(_j, _jLen) {
          if (node[i][tId] === restData[_j][pId]) {
            var _child;

            if (!node[i][children]) {
              (0, _assign2.default)(node[i], (0, _defineProperty3.default)({}, children, []));
            }
            var child = (_child = {}, (0, _defineProperty3.default)(_child, tId, restData[_j][id]), (0, _defineProperty3.default)(_child, tName, restData[_j][name]), _child);
            otherKeys.forEach(function (key) {
              (0, _assign2.default)(child, (0, _defineProperty3.default)({}, key, restData[_j][key]));
            });
            node[i][children].push(child);
            restData.splice(_j, 1);
            _jLen -= 1;
            _j -= 1;
          }
          j = _j;
          jLen = _jLen;
        };

        for (var j = 0, jLen = restData.length; j < jLen; j++) {
          _loop2(j, jLen);
        }
        if (node[i][children]) pickChild(node[i][children]);
      }
    }
  };

  pickChild(treeData);

  return treeData;
};

exports.treePick = treePick;
exports.treeDataMatch = treeDataMatch;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
*
* @example
*
* const treeData = [
*   { id: '330000', name: '浙江省', children: [
*     { id: '330100', name: '杭州市' },
*     { id: '330200', name: '宁波市' },
*   ]},
*   { id: '320000', name: '江苏省', children: [
*     { id: '320100', name: '南京市' },
*     { id: '320200', name: '无锡市' },
*   ]},
* ];
*
* treePick(treeData, ['330000', '330100']);
* // => ['浙江省', '杭州市'];
*/
function treePick() {
  var treeData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _attributes$origin = attributes.origin,
      origin = _attributes$origin === undefined ? 'id' : _attributes$origin,
      _attributes$key = attributes.key,
      key = _attributes$key === undefined ? 'name' : _attributes$key,
      _attributes$children2 = attributes.children,
      children = _attributes$children2 === undefined ? 'children' : _attributes$children2;

  var newValues = [];
  var pick = function pick() {
    var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    source.some(function (item) {
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
* 判断某项数据是否存在
*
* @param {Object[]} treeData - 源数据
* @param {String} value - 属性值
* @param {Object} [attributes] - 配置参数
* @param {String} [attributes.key='id'] - key
* @param {String} [attributes.children='children'] - 子集合key
* @return {Boolean} 是否存在
*
* @example
*
* const treeData = [
*   { id: '330000', name: '浙江省', children: [
*     { id: '330100', name: '杭州市' },
*     { id: '330200', name: '宁波市' },
*   ]},
* ];
*
* treeDataMatch(treeData, '杭州市', { key: 'name' });
* // => true
*/
/**
 * 树结构数据操作
 */

/**
 * 数据转换
 * 将具有层级关系的数组转化为树结构数组
 *
 * @param {Object} attributes - 配置参数
 * @param {String} attributes.pId - 源数据父主键key
 * @param {String} [attributes.rootId] - 源数据根节点主键值，将父主键值与之相等的数据视为顶层树节点【缺省此参数，将没有父主键的数据视为顶层树节点】
 * @param {String} [attributes.id='id'] - 源数据主键key
 * @param {String} [attributes.name='name'] - 源数据名称key
 * @param {String} [attributes.tId='id'] - 树节点主键key
 * @param {String} [attributes.tName='name'] - 树节点名称key
 * @param {String} [attributes.children='children'] - 子集合key
 * @param {Array} [attributes.otherKeys=[]] - 其他key【将转化为树节点属性】
 * @param {Object[]} source - 源数据【有层级关系】
 * @return {Object[]} 树结构数据
 *
 * @example
 *
 * const attributes = {rootId: '100000', pId: 'parentId', name: 'value'};
 * const source = [
 *   { id: '330000', value: '浙江省', parentId: '100000' },
 *   { id: '330100', value: '杭州市', parentId: '330000' },
 *   { id: '330200', value: '宁波市', parentId: '330000' },
 *   { id: '320000', value: '江苏省', parentId: '100000' },
 *   { id: '320100', value: '南京市', parentId: '320000' },
 *   { id: '320200', value: '无锡市', parentId: '320000' },
 * ];
 *
 * treeConvert(attributes, source);
 * // => [
 *   { id: '330000', name: '浙江省', children: [
 *     { id: '330100', name: '杭州市' },
 *     { id: '330200', name: '宁波市' },
 *   ]},
 *   { id: '320000', name: '江苏省', children: [
 *     { id: '320100', name: '南京市' },
 *     { id: '320200', name: '无锡市' },
 *   ]},
 * ]
 */
function treeDataMatch() {
  var treeData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var value = arguments[1];
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _attributes$key2 = attributes.key,
      key = _attributes$key2 === undefined ? 'id' : _attributes$key2,
      _attributes$children3 = attributes.children,
      children = _attributes$children3 === undefined ? 'children' : _attributes$children3;

  var find = function find(data) {
    return data.some(function (item) {
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