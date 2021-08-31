"use strict";

var getSizeAfterTransformations = require('./getSizeAfterTransformations');

var createUrl = require('./createUrl');

var objectAssign = require('object-assign');

module.exports = function () {
  var field = {
    type: 'DatoCmsFixed',
    args: {
      width: {
        type: 'Int',
        defaultValue: 400
      },
      height: 'Int',
      forceBlurhash: 'Boolean',
      imgixParams: 'DatoCmsImgixParams'
    },
    resolve: function resolve(node, _ref) {
      var forceBlurhash = _ref.forceBlurhash,
          width = _ref.width,
          height = _ref.height,
          _ref$imgixParams = _ref.imgixParams,
          imgixParams = _ref$imgixParams === void 0 ? {} : _ref$imgixParams;
      var image = node.entityPayload.attributes;

      if (!image.is_image || image.format === 'svg') {
        return null;
      }

      var mergedImgixParams = objectAssign({}, imgixParams, {
        w: width
      }, height && {
        h: height
      });

      var _getSizeAfterTransfor = getSizeAfterTransformations(image.width, image.height, mergedImgixParams),
          finalWidth = _getSizeAfterTransfor.width,
          finalHeight = _getSizeAfterTransfor.height;

      var aspectRatio = finalWidth / finalHeight;
      var srcSet = [1, 1.5, 2, 3].map(function (dpr) {
        var extraParams = {
          dpr: dpr
        };

        if (!mergedImgixParams.w && !mergedImgixParams.h) {
          extraParams.w = finalWidth;
        }

        var url = createUrl(image.url, objectAssign({}, mergedImgixParams, extraParams), {
          autoFormat: true,
          focalPoint: node.focalPoint
        });
        return "".concat(url, " ").concat(dpr, "x");
      }).join(",\n");
      return {
        aspectRatio: aspectRatio,
        width: finalWidth,
        height: finalHeight,
        format: image.format,
        src: createUrl(image.url, mergedImgixParams, {
          autoFormat: true,
          focalPoint: node.focalPoint
        }),
        srcSet: srcSet,
        forceBlurhash: forceBlurhash
      };
    }
  };
  return {
    fixed: field,
    resolutions: field
  };
};