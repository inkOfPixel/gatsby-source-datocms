"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createUrl = require('./createUrl');

var getSizeAfterTransformations = require('./getSizeAfterTransformations');

var getBase64 = require('./getBase64');

var getTracedSVG = require('./getTracedSVG');

var toHex = require('./toHex');

var generateImageSource = function generateImageSource(baseURL, width, height, format, fit, _ref) {
  var focalPoint = _ref.focalPoint,
      imgixParams = _ref.imgixParams,
      finalSize = _ref.finalSize;
  var extraParams = {};
  var scale = Math.max(0.01, Math.ceil(width / finalSize.width * 100) / 100);

  if (scale !== 1.0) {
    extraParams.dpr = scale;
  }

  if (!imgixParams.w && !imgixParams.h) {
    extraParams.w = finalSize.width;
  }

  var src = createUrl(baseURL, _objectSpread({}, imgixParams, {}, extraParams), {
    autoFormat: true,
    focalPoint: focalPoint
  });
  return {
    src: src,
    width: width,
    height: height,
    format: format
  };
};

module.exports = function (_ref2) {
  var cacheDir = _ref2.cacheDir;
  var gatsbyPluginImageFound = false;

  try {
    require('gatsby-plugin-image');

    gatsbyPluginImageFound = true;
  } catch (e) {}

  if (!gatsbyPluginImageFound) {
    return {};
  }

  var _require = require('gatsby-plugin-image/graphql-utils'),
      getGatsbyImageResolver = _require.getGatsbyImageResolver;

  var _require2 = require('gatsby-plugin-image'),
      generateImageData = _require2.generateImageData;

  function resolve(_x, _x2) {
    return _resolve.apply(this, arguments);
  }

  function _resolve() {
    _resolve = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(node, _ref3) {
      var _node$entityPayload;

      var _ref3$imgixParams, imgixParams, _ref3$placeholder, placeholder, forceBlurhash, props, image, finalSize, sourceMetadata, otherProps, placeholderImageData;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref3$imgixParams = _ref3.imgixParams, imgixParams = _ref3$imgixParams === void 0 ? {} : _ref3$imgixParams, _ref3$placeholder = _ref3.placeholder, placeholder = _ref3$placeholder === void 0 ? 'BLURRED' : _ref3$placeholder, forceBlurhash = _ref3.forceBlurhash, props = _objectWithoutProperties(_ref3, ["imgixParams", "placeholder", "forceBlurhash"]);
              image = node === null || node === void 0 ? void 0 : (_node$entityPayload = node.entityPayload) === null || _node$entityPayload === void 0 ? void 0 : _node$entityPayload.attributes;

              if (!(!image.is_image || image.format === 'svg')) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", null);

            case 4:
              finalSize = getSizeAfterTransformations(image.width, image.height, imgixParams); // props.width and props.height
              // * For a fixed layout, these define the size of the image displayed on screen.
              // * For a constrained image, these define the maximum size, as the image will scale down to fit smaller containers if needed.
              // * For a full width layout, these are ignored
              //
              // If the imgixParams do not specify how/if the image should be resized,
              // than we apply some sensible defaults using props.image and props.height
              // otherwise, imgixParams decide the width/height of the source image,
              // and props.width/props.height only determine how big the <img /> will
              // be presented to the final user

              if (finalSize.height === image.height && finalSize.width == image.width) {
                if (props.layout === 'FIXED' && props.width && props.height) {
                  // we give the source image the requested aspect ratio
                  imgixParams.ar = "".concat(props.width, ":").concat(props.height);
                  imgixParams.fit = 'crop';
                  finalSize = getSizeAfterTransformations(image.width, image.height, imgixParams);
                } else if (props.layout === 'CONSTRAINED' && (props.width || props.height)) {
                  // we give the source image the requested width/height as their maximum value
                  if (props.w) {
                    imgixParams.w = props.width;
                  }

                  if (props.h) {
                    imgixParams.h = props.height;
                  }

                  imgixParams.fit = 'max';
                  finalSize = getSizeAfterTransformations(image.width, image.height, imgixParams);
                }
              }

              sourceMetadata = {
                width: finalSize.width,
                height: finalSize.height,
                format: image.format === 'jpeg' ? 'jpg' : image.format
              };
              otherProps = {};
              placeholderImageData = _objectSpread({}, sourceMetadata, {
                forceBlurhash: forceBlurhash,
                src: createUrl(image.url, imgixParams, {
                  autoFormat: true,
                  focalPoint: node.focalPoint
                })
              });

              if (!(placeholder === 'DOMINANT_COLOR')) {
                _context.next = 13;
                break;
              }

              otherProps.backgroundColor = image.colors[0] && toHex(image.colors[0]);
              _context.next = 23;
              break;

            case 13:
              if (!(placeholder === 'BLURRED')) {
                _context.next = 19;
                break;
              }

              _context.next = 16;
              return getBase64(placeholderImageData, cacheDir);

            case 16:
              otherProps.placeholderURL = _context.sent;
              _context.next = 23;
              break;

            case 19:
              if (!(placeholder === 'TRACED_SVG')) {
                _context.next = 23;
                break;
              }

              _context.next = 22;
              return getTracedSVG(placeholderImageData, cacheDir);

            case 22:
              otherProps.placeholderURL = _context.sent;

            case 23:
              return _context.abrupt("return", generateImageData(_objectSpread({
                filename: image.url,
                pluginName: 'gatsby-source-datocms',
                generateImageSource: generateImageSource,
                sourceMetadata: sourceMetadata,
                formats: ['auto'],
                options: {
                  imgixParams: imgixParams,
                  focalPoint: node.focalPoint,
                  finalSize: finalSize
                }
              }, otherProps, {}, props)));

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _resolve.apply(this, arguments);
  }

  var resolver = getGatsbyImageResolver(resolve, {
    imgixParams: 'DatoCmsImgixParams',
    forceBlurhash: 'Boolean',
    placeholder: {
      type: 'enum DatoImagePlaceholder { NONE, DOMINANT_COLOR, TRACED_SVG, BLURRED }',
      description: "Format of generated placeholder, displayed while the main image loads.\nDOMINANT_COLOR: a solid color, calculated from the dominant color of the image (default).\nBLURRED: a blurred, low resolution image, encoded as a base64 data URI\nTRACED_SVG: a low-resolution traced SVG of the image. Note that this will download the image at build time for processing.\nNONE: no placeholder. Set \"backgroundColor\" to use a fixed background color."
    }
  });
  return {
    gatsbyImageData: _objectSpread({}, resolver, {
      type: 'JSON'
    })
  };
};