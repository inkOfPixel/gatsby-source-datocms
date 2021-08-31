"use strict";

var getSizeAfterTransformations = require('./getSizeAfterTransformations');

var createUrl = require('./createUrl');

var objectAssign = require('object-assign');

module.exports = function () {
  var field = {
    type: 'DatoCmsFluid',
    args: {
      maxWidth: {
        type: 'Int',
        defaultValue: 800
      },
      maxHeight: 'Int',
      sizes: 'String',
      imgixParams: 'DatoCmsImgixParams',
      forceBlurhash: 'Boolean'
    },
    resolve: function resolve(node, _ref) {
      var forceBlurhash = _ref.forceBlurhash,
          maxWidth = _ref.maxWidth,
          maxHeight = _ref.maxHeight,
          _ref$imgixParams = _ref.imgixParams,
          imgixParams = _ref$imgixParams === void 0 ? {} : _ref$imgixParams,
          sizes = _ref.sizes;
      var image = node.entityPayload.attributes;

      if (!image.is_image || image.format === 'svg') {
        return null;
      }

      var _getSizeAfterTransfor = getSizeAfterTransformations(image.width, image.height, imgixParams),
          finalWidth = _getSizeAfterTransfor.width,
          finalHeight = _getSizeAfterTransfor.height;

      var aspectRatio = finalWidth / finalHeight;
      var realMaxWidth = maxHeight ? maxHeight * aspectRatio : maxWidth;
      var realSizes = sizes || "(max-width: ".concat(realMaxWidth, "px) 100vw, ").concat(realMaxWidth, "px");
      var srcSet = [0.25, 0.5, 1, 1.5, 2, 3].map(function (m) {
        return realMaxWidth * m;
      }).map(Math.round).filter(function (screen) {
        return screen < finalWidth;
      }).concat([finalWidth]).map(function (screen) {
        var extraParams = {
          dpr: Math.max(0.01, Math.ceil(screen / finalWidth * 100) / 100)
        };

        if (!imgixParams.w && !imgixParams.h) {
          extraParams.w = finalWidth;
        }

        var url = createUrl(image.url, objectAssign({}, imgixParams, extraParams), {
          autoFormat: true,
          focalPoint: node.focalPoint
        });
        return "".concat(url, " ").concat(Math.round(screen), "w");
      }).join(",\n");
      return {
        aspectRatio: aspectRatio,
        src: createUrl(image.url, imgixParams, {
          autoFormat: true,
          focalPoint: node.focalPoint
        }),
        width: finalWidth,
        height: finalHeight,
        format: image.format,
        srcSet: srcSet,
        sizes: realSizes,
        forceBlurhash: forceBlurhash
      };
    }
  };
  return {
    fluid: field,
    sizes: field
  };
};