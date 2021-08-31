"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('humps'),
    camelizeKeys = _require.camelizeKeys;

module.exports = function () {
  return {
    type: '[DatoCmsFileField]',
    resolveForSimpleField: function resolveForSimpleField(fieldValue, context, node) {
      if (!fieldValue) {
        return null;
      }

      return fieldValue.map(function (fileField) {
        var upload = context.nodeModel.getNodeById({
          id: "DatoCmsAsset-".concat(fileField.upload_id)
        });
        var uploadDefaultFieldMetadata = upload.entityPayload.attributes.default_field_metadata[node.locale];
        return _objectSpread({}, upload, {
          alt: fileField.alt || uploadDefaultFieldMetadata.alt,
          title: fileField.title || uploadDefaultFieldMetadata.title,
          focalPoint: fileField.focal_point || uploadDefaultFieldMetadata.focal_point,
          customData: _objectSpread({}, camelizeKeys(uploadDefaultFieldMetadata.custom_data), {}, fileField.custom_data)
        });
      });
    }
  };
};