"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toConsumableArray"));

/**
 * 树结构数据操作
 *
 * dataConvert - 数据转换
 * dataPick - 数据提取
 * dataMatch - 判断数据是否存在
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
function dataConvert() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rootId = attributes.rootId,
      pId = attributes.pId,
      _attributes$id = attributes.id,
      id = _attributes$id === void 0 ? 'id' : _attributes$id,
      _attributes$name = attributes.name,
      name = _attributes$name === void 0 ? 'name' : _attributes$name,
      _attributes$tId = attributes.tId,
      tId = _attributes$tId === void 0 ? 'id' : _attributes$tId,
      _attributes$tName = attributes.tName,
      tName = _attributes$tName === void 0 ? 'name' : _attributes$tName,
      _attributes$children = attributes.children,
      children = _attributes$children === void 0 ? 'children' : _attributes$children,
      _attributes$otherKeys = attributes.otherKeys,
      otherKeys = _attributes$otherKeys === void 0 ? [] : _attributes$otherKeys,
      onParse = attributes.onParse;
  var restData = (0, _toConsumableArray2.default)(source); // 源数据

  var treeData = []; // 树结构数据
  // 根节点解析

  var _loop = function _loop(_i, _iLen) {
    if (onParse && typeof onParse === 'function') {
      onParse(restData[_i]);
    }

    if (restData[_i][pId] === rootId) {
      var _node;

      var node = (_node = {}, (0, _defineProperty2.default)(_node, tId, restData[_i][id]), (0, _defineProperty2.default)(_node, tName, restData[_i][name]), _node);
      otherKeys.forEach(function (key) {
        (0, _assign.default)(node, (0, _defineProperty2.default)({}, key, restData[_i][key]));
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
  } // 子节点解析


  var pickChild = function pickChild(node) {
    if (restData.length !== 0) {
      for (var _i2 = 0, _iLen2 = node.length; _i2 < _iLen2; _i2++) {
        var _loop2 = function _loop2(_j, _jLen) {
          if (node[_i2][tId] === restData[_j][pId]) {
            var _child;

            if (!node[_i2][children]) {
              (0, _assign.default)(node[_i2], (0, _defineProperty2.default)({}, children, []));
            }

            var child = (_child = {}, (0, _defineProperty2.default)(_child, tId, restData[_j][id]), (0, _defineProperty2.default)(_child, tName, restData[_j][name]), _child);
            otherKeys.forEach(function (key) {
              (0, _assign.default)(child, (0, _defineProperty2.default)({}, key, restData[_j][key]));
            });

            node[_i2][children].push(child);

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

        if (node[_i2][children]) {
          pickChild(node[_i2][children]);
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


function dataPick() {
  var treeData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _attributes$origin = attributes.origin,
      origin = _attributes$origin === void 0 ? 'id' : _attributes$origin,
      _attributes$key = attributes.key,
      key = _attributes$key === void 0 ? 'name' : _attributes$key,
      _attributes$children2 = attributes.children,
      children = _attributes$children2 === void 0 ? 'children' : _attributes$children2;
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


function dataMatch() {
  var treeData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var value = arguments.length > 1 ? arguments[1] : undefined;
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _attributes$key2 = attributes.key,
      key = _attributes$key2 === void 0 ? 'id' : _attributes$key2,
      _attributes$children3 = attributes.children,
      children = _attributes$children3 === void 0 ? 'children' : _attributes$children3;

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

var _default = {
  dataConvert: dataConvert,
  dataPick: dataPick,
  dataMatch: dataMatch
};
exports.default = _default;