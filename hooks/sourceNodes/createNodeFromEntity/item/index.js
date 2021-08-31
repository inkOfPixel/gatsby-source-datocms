"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require('humps'),
    pascalize = _require.pascalize;

var _require2 = require('datocms-client'),
    camelize = _require2.camelize;

var _require3 = require('datocms-client'),
    localizedRead = _require3.localizedRead;

var buildNode = require('../utils/buildNode');

module.exports = function buildItemNode(entity, _ref) {
  var _ref2;

  var entitiesRepo = _ref.entitiesRepo,
      localeFallbacks = _ref.localeFallbacks,
      generateType = _ref.generateType;
  var siteEntity = entitiesRepo.site;
  var type = generateType("".concat(pascalize(entity.itemType.apiKey)));
  return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(siteEntity.locales.map(function (locale) {
    var additionalNodesToCreate = [];
    var i18n = {
      locale: locale,
      fallbacks: localeFallbacks
    };
    var itemNode = buildNode(type, "".concat(entity.id, "-").concat(locale), function (node) {
      node.locale = locale;
      node.entityPayload = entity.payload;
      node.digest = entity.meta.updatedAt;
      entity.itemType.fields.filter(function (field) {
        return field.fieldType === 'text';
      }).forEach(function (field) {
        var camelizedApiKey = camelize(field.apiKey);
        var mediaType = 'text/plain';

        if (field.appeareance.editor === 'markdown') {
          mediaType = 'text/markdown';
        } else if (field.appeareance.editor === 'wysiwyg') {
          mediaType = 'text/html';
        }

        var value = localizedRead(entity, camelizedApiKey, field.localized, i18n);
        var textNode = buildNode('DatoCmsTextNode', "".concat(node.id, "-").concat(camelizedApiKey), function (node) {
          node.internal.mediaType = mediaType;
          node.internal.content = value || '';
          node.digest = entity.meta.updatedAt;
        });
        additionalNodesToCreate.push(textNode);
      });
      var seoNode = buildNode(generateType('SeoMetaTags'), node.id, function (node) {
        node.digest = entity.meta.updatedAt;
        node.itemNodeId = "".concat(type, "-").concat(entity.id, "-").concat(locale);
        node.locale = locale;
      });
      additionalNodesToCreate.push(seoNode);
      node.seoMetaTags___NODE = seoNode.id;
    });
    return [itemNode].concat(additionalNodesToCreate);
  })));
};