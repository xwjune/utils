'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 通用方法
 *
 * generateUUID - 生成uuid
 * getParameter - 获取url中的参数
 */
var Common = function () {
  function Common() {
    (0, _classCallCheck3.default)(this, Common);
  }

  (0, _createClass3.default)(Common, [{
    key: 'generateUUID',

    /**
     * 生成uuid
     *
     * @return uuid
     * @example
     *
     * generateUUID()
     * // => cd2f4b1f-daf2-451c-a9a6-db716c1d82bb
     */
    value: function generateUUID() {
      /* eslint-disable no-bitwise */
      /* eslint-disable no-mixed-operators */
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      return uuid;
    }

    /**
     * 获取url中的参数
     *
     * @param {String} name - 参数名
     * @param {String} [url=window.location.search] - 链接
     * @return {String} 参数值
     * @example
     *
     * getParameter('name', 'http://www.w3school.com?name=xxx')
     * // => xxx
     */

  }, {
    key: 'getParameter',
    value: function getParameter(name) {
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.search;

      var reg = new RegExp('[?&]' + name + '=([^&]*)', 'ig');
      var r = reg.exec(url);
      return r === null ? '' : decodeURIComponent(r[1]);
    }
  }]);
  return Common;
}();

exports.default = new Common();