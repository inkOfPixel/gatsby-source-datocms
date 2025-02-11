"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildAssetFields = require('../utils/buildAssetFields');

module.exports = function (_ref) {
  var actions = _ref.actions,
      schema = _ref.schema,
      store = _ref.store,
      cacheDir = _ref.cacheDir,
      generateType = _ref.generateType;
  actions.createTypes([schema.buildObjectType({
    name: generateType('Asset'),
    extensions: {
      infer: false
    },
    fields: _objectSpread({}, buildAssetFields({
      cacheDir: cacheDir
    })),
    interfaces: ['Node']
  }), schema.buildEnumType({
    name: 'DatoCmsAssetVideoThumbnailFormat',
    values: {
      jpg: {
        value: 'jpg'
      },
      png: {
        value: 'png'
      },
      gif: {
        value: 'gif'
      }
    }
  }), schema.buildEnumType({
    name: 'DatoCmsAssetVideoMp4ResolutionQuality',
    values: {
      low: {
        value: 'low'
      },
      medium: {
        value: 'medium'
      },
      high: {
        value: 'high'
      }
    }
  }), schema.buildObjectType({
    name: 'DatoCmsAssetVideo',
    extensions: {
      infer: false
    },
    fields: {
      muxPlaybackId: 'String',
      frameRate: 'Int',
      duration: 'Int',
      streamingUrl: {
        type: 'String',
        resolve: function resolve(upload) {
          return "https://stream.mux.com/".concat(upload.muxPlaybackId, ".m3u8");
        }
      },
      thumbnailUrl: {
        type: 'String',
        args: {
          format: 'DatoCmsAssetVideoThumbnailFormat'
        },
        resolve: function resolve(upload, _ref2) {
          var _ref2$format = _ref2.format,
              format = _ref2$format === void 0 ? 'jpg' : _ref2$format;

          if (format === 'gif') {
            return "https://image.mux.com/".concat(upload.muxPlaybackId, "/animated.gif");
          }

          return "https://image.mux.com/".concat(upload.muxPlaybackId, "/thumbnail.").concat(format);
        }
      },
      mp4Url: {
        type: 'String',
        args: {
          res: 'DatoCmsAssetVideoMp4ResolutionQuality',
          exactRes: 'DatoCmsAssetVideoMp4ResolutionQuality'
        },
        resolve: function resolve(upload, args) {
          if (!upload.muxMp4HighestRes) {
            return null;
          }

          if (args.exactRes) {
            if (args.exactRes === 'low') {
              return "https://stream.mux.com/".concat(upload.muxPlaybackId, "/low.mp4");
            }

            if (args.exactRes === 'medium') {
              return ['medium', 'high'].includes(upload.muxMp4HighestRes) ? "https://stream.mux.com/".concat(upload.muxPlaybackId, "/medium.mp4") : null;
            }

            if (upload.muxMp4HighestRes === 'high') {
              return "https://stream.mux.com/".concat(upload.muxPlaybackId, "/high.mp4");
            }

            return null;
          }

          if (args.res === 'low') {
            return "https://stream.mux.com/".concat(upload.muxPlaybackId, "/low.mp4");
          }

          if (args.res === 'medium') {
            if (['low', 'medium'].includes(upload.muxMp4HighestRes)) {
              return "https://stream.mux.com/".concat(upload.muxPlaybackId, "/").concat(upload.muxMp4HighestRes, ".mp4");
            }

            return "https://stream.mux.com/".concat(upload.muxPlaybackId, "/medium.mp4");
          }

          return "https://stream.mux.com/".concat(upload.muxPlaybackId, "/").concat(upload.muxMp4HighestRes, ".mp4");
        }
      }
    }
  })]);
};