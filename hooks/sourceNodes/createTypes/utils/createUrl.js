"use strict";

var _require = require('humps'),
    decamelizeKeys = _require.decamelizeKeys;

var objectAssign = require('object-assign');

var queryString = require('query-string');

module.exports = function (imageUrl) {
  var imgixParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var mergedParams = decamelizeKeys(imgixParams, {
    separator: '-'
  });
  var mergedOptions = objectAssign({
    autoFormat: false,
    focalPoint: null
  }, options);

  if (mergedOptions.autoFormat && !mergedParams.fm) {
    var auto = (mergedParams.auto || '').split(',');
    mergedParams.auto = auto.filter(function (a) {
      return !!a && a !== 'format';
    }).concat(['format']).join(',');
  }

  if (mergedOptions.focalPoint && mergedParams.fit === 'crop' && ((mergedParams.h || mergedParams.height) && (mergedParams.w || mergedParams.width) || mergedParams.ar) && (!mergedParams.crop || mergedParams.crop === 'focalpoint') && !mergedParams['fp-x'] && !mergedParams['fp-y']) {
    mergedParams.crop = 'focalpoint';
    mergedParams['fp-x'] = mergedOptions.focalPoint.x;
    mergedParams['fp-y'] = mergedOptions.focalPoint.y;
  }

  if (Object.keys(mergedParams).length === 0) {
    return imageUrl;
  }

  return "".concat(imageUrl, "?").concat(queryString.stringify(mergedParams));
};