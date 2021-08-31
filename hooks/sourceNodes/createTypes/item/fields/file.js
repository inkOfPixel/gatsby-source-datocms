"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('datocms-client'),
    camelizeKeys = _require.camelizeKeys;

function localizedDefaultFieldMetadata(metadata, attribute, i18n) {
  var fallbacks = i18n.fallbacks || {};
  var locales = [i18n.locale].concat(fallbacks[i18n.locale] || []);
  var localeWithValue = locales.find(function (locale) {
    var localeValue = metadata[locale] && metadata[locale][attribute];
    return localeValue && localeValue !== null && localeValue !== undefined && localeValue !== '';
  });
  return localeWithValue ? metadata[localeWithValue][attribute] : null;
}

module.exports = function () {
  return {
    type: 'DatoCmsFileField',
    resolveForSimpleField: function resolveForSimpleField(fieldValue, context, node, i18n) {
      if (!fieldValue) {
        return null;
      }

      var upload = context.nodeModel.getNodeById({
        id: "DatoCmsAsset-".concat(fieldValue.upload_id)
      });
      var defaultAlt = localizedDefaultFieldMetadata(upload.entityPayload.attributes.default_field_metadata, 'alt', i18n);
      var defaultTitle = localizedDefaultFieldMetadata(upload.entityPayload.attributes.default_field_metadata, 'title', i18n);
      var defaultFocalPoint = localizedDefaultFieldMetadata(upload.entityPayload.attributes.default_field_metadata, 'focal_point', i18n);
      var defaultCustomData = localizedDefaultFieldMetadata(upload.entityPayload.attributes.default_field_metadata, 'custom_data', i18n);
      var fallbackFocalPoint = upload.entityPayload.attributes.is_image && upload.entityPayload.attributes.format !== 'svg' ? {
        x: 0.5,
        y: 0.5
      } : null;
      return _objectSpread({}, upload, {
        alt: fieldValue.alt || defaultAlt,
        title: fieldValue.title || defaultTitle,
        focalPoint: fieldValue.focal_point || defaultFocalPoint || fallbackFocalPoint,
        customData: _objectSpread({}, camelizeKeys(defaultCustomData), {}, fieldValue.custom_data)
      });
    }
  };
};