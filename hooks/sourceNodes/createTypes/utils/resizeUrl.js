"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var queryString = require('query-string');

var createUrl = require('./createUrl');

var objectAssign = require('object-assign');

module.exports = function (_ref, size) {
  var url = _ref.url,
      width = _ref.width,
      height = _ref.height;

  var _url$split = url.split('?'),
      _url$split2 = _slicedToArray(_url$split, 2),
      baseUrl = _url$split2[0],
      query = _url$split2[1];

  var imgixParams = queryString.parse(query);
  var dpr = width > height ? Math.ceil(size / width * 100) / 100 : Math.ceil(size / height * 100) / 100;
  var extraParams = {
    dpr: Math.max(0.01, dpr),
    fm: 'png'
  };

  if (!imgixParams.w && !imgixParams.h) {
    extraParams.w = width;
  }

  var auto = (imgixParams.auto || '').split(',');

  if (auto.length > 0) {
    extraParams.auto = auto.filter(function (a) {
      return !!a && a !== 'format';
    }).join(',');
  }

  extraParams.q = '30';
  return createUrl(baseUrl, objectAssign({}, imgixParams, extraParams), {
    autoFormat: false
  });
};