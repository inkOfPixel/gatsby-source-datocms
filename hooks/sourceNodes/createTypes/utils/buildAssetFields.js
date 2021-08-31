"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var queryString = require('query-string');

var _require = require('datocms-client'),
    camelizeKeys = _require.camelizeKeys;

var buildFluidFields = require('../utils/buildFluidFields');

var buildFixedFields = require('../utils/buildFixedFields');

var createUrl = require('./createUrl');

var buildGatsbyImageDataFields = require('./buildGatsbyImageDataFields');

var resolveUsingEntityPayloadAttribute = function resolveUsingEntityPayloadAttribute(key, definition) {
  var camelize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return _objectSpread({}, definition, {
    resolve: function resolve(node) {
      return camelize ? camelizeKeys(node.entityPayload.attributes[key]) : node.entityPayload.attributes[key];
    }
  });
};

module.exports = function (_ref) {
  var cacheDir = _ref.cacheDir;
  return _objectSpread({
    size: resolveUsingEntityPayloadAttribute('size', {
      type: 'Int'
    }),
    width: resolveUsingEntityPayloadAttribute('width', {
      type: 'Int'
    }),
    height: resolveUsingEntityPayloadAttribute('height', {
      type: 'Int'
    }),
    path: resolveUsingEntityPayloadAttribute('path', {
      type: 'String'
    }),
    format: resolveUsingEntityPayloadAttribute('format', {
      type: 'String'
    }),
    isImage: resolveUsingEntityPayloadAttribute('is_image', {
      type: 'Boolean'
    }),
    notes: resolveUsingEntityPayloadAttribute('notes', {
      type: 'String'
    }),
    author: resolveUsingEntityPayloadAttribute('author', {
      type: 'String'
    }),
    copyright: resolveUsingEntityPayloadAttribute('copyright', {
      type: 'String'
    }),
    tags: resolveUsingEntityPayloadAttribute('tags', {
      type: '[String]'
    }),
    smartTags: resolveUsingEntityPayloadAttribute('smart_tags', {
      type: '[String]'
    }),
    filename: resolveUsingEntityPayloadAttribute('filename', {
      type: 'String'
    }),
    basename: resolveUsingEntityPayloadAttribute('basename', {
      type: 'String'
    }),
    exifInfo: resolveUsingEntityPayloadAttribute('exif_info', {
      type: 'JSON'
    }, true),
    mimeType: resolveUsingEntityPayloadAttribute('mime_type', {
      type: 'String'
    }),
    colors: resolveUsingEntityPayloadAttribute('colors', {
      type: '[DatoCmsColorField]'
    }),
    blurhash: resolveUsingEntityPayloadAttribute('blurhash', {
      type: 'String'
    }),
    originalId: {
      type: 'String',
      resolve: function resolve(node) {
        return node.entityPayload.id;
      }
    },
    url: {
      type: 'String',
      args: {
        imgixParams: 'DatoCmsImgixParams'
      },
      resolve: function resolve(node, args) {
        var url = "".concat(node.imgixHost).concat(node.entityPayload.attributes.path);
        return createUrl(url, args.imgixParams, {
          autoFormat: node.entityPayload.attributes.is_image && node.entityPayload.attributes.format !== 'svg',
          focalPoint: node.focalPoint
        });
      }
    },
    createdAt: resolveUsingEntityPayloadAttribute('created_at', {
      type: 'Date',
      extensions: {
        dateformat: {},
        proxy: {}
      }
    }),
    video: {
      type: 'DatoCmsAssetVideo',
      resolve: function resolve(upload) {
        if (upload.entityPayload.attributes.mux_playback_id) {
          return camelizeKeys(upload.entityPayload.attributes);
        }

        return null;
      }
    }
  }, buildFluidFields(), {}, buildFixedFields(), {}, buildGatsbyImageDataFields({
    cacheDir: cacheDir
  }));
};