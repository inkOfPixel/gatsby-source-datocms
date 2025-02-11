"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function getSizeAfterTransformations(originalWidth, originalHeight) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var originalAspectRatio = originalWidth / originalHeight;
  var width = originalWidth;
  var height = originalHeight;

  if (params.rect) {
    var _params$rect$split$sl = params.rect.split(',').slice(2, 4),
        _params$rect$split$sl2 = _slicedToArray(_params$rect$split$sl, 2),
        w = _params$rect$split$sl2[0],
        h = _params$rect$split$sl2[1];

    width = Math.min(Math.max(0, parseInt(w)), originalWidth);
    height = Math.min(Math.max(0, parseInt(h)), originalHeight);
  }

  if (['facearea', 'clamp', 'fill', 'fillmax', 'scale'].includes(params.fit) && params.w && params.h) {
    width = parseInt(params.w);
    height = parseInt(params.h);
    return {
      width: width,
      height: height
    };
  }

  if (params.fit === 'crop' && (params.w && params.h || params.ar)) {
    var _width = null;
    var _height = null;

    var _w = params.w && parseInt(params.w);

    var _h = params.h && parseInt(params.h);

    if (params.ar) {
      var _params$ar$split = params.ar.split(':'),
          _params$ar$split2 = _slicedToArray(_params$ar$split, 2),
          arW = _params$ar$split2[0],
          arH = _params$ar$split2[1];

      var aspectRatio = parseFloat(arW) / (arH ? parseInt(arH) : 1);
      var originalAr = originalWidth / originalHeight;
      var aspectRatioSize = aspectRatio > originalAr ? [originalWidth, originalWidth / aspectRatio] : [originalHeight * aspectRatio, originalHeight];

      if (_w) {
        _width = _w;
        _height = _h / aspectRatio;
      } else if (_h) {
        _height = _h;
        _width = _h * aspectRatio;
      } else {
        _width = aspectRatioSize[0];
        _height = aspectRatioSize[1];
      }
    } else {
      _width = _w;
      _height = _h;
    }

    if (params['max-h']) {
      _height = Math.min(_height, parseInt(params['max-h']));
    }

    if (params['max-w']) {
      _width = Math.min(_width, parseInt(params['max-w']));
    }

    if (params['min-h']) {
      _height = Math.max(_height, parseInt(params['min-h']));
    }

    if (params['min-w']) {
      _width = Math.max(_width, parseInt(params['min-w']));
    }

    return {
      width: _width,
      height: _height
    };
  }

  if (params.fit === 'min' && (params.w || params.h)) {
    var _w2 = params.w ? parseInt(params.w) : Math.round(parseInt(params.h) * originalAspectRatio);

    var _h2 = params.h ? parseInt(params.h) : Math.round(parseInt(params.w) / originalAspectRatio);

    var resize = Math.min(width / _w2, height / _h2);
    width = Math.round(width * resize);
    height = Math.round(height * resize);
    return {
      width: width,
      height: height
    };
  }

  if (params.w || params.h) {
    var scales = [];

    if (params.w) {
      scales.push(parseInt(params.w) / width);
    }

    if (params.h) {
      scales.push(parseInt(params.h) / height);
    }

    var scale = Math.min.apply(Math, scales);

    if (params.fit === 'max') {
      scale = Math.max(1, scale);
    }

    width = Math.round(scale * width);
    height = Math.round(scale * height);
    return {
      width: width,
      height: height
    };
  }

  return {
    width: width,
    height: height
  };
};