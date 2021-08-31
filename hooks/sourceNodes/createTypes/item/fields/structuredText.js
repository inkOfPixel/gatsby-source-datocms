"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('humps'),
    pascalize = _require.pascalize;

var visit = require('unist-util-visit');

var _require2 = require('datocms-structured-text-utils'),
    isInlineItem = _require2.isInlineItem,
    isItemLink = _require2.isItemLink,
    isBlock = _require2.isBlock;

var uniq = require('lodash.uniq');

var itemNodeId = require('../../utils/itemNodeId');

var buildFor = function buildFor(unionType, itemTypeIds, entitiesRepo, gqlItemTypeName, schema) {
  if (itemTypeIds.length === 0) {
    return ['String', null];
  }

  if (itemTypeIds.length === 1) {
    var linkedItemType = entitiesRepo.findEntity('item_type', itemTypeIds[0]);
    return [gqlItemTypeName(linkedItemType), null];
  }

  return [unionType, schema.buildUnionType({
    name: unionType,
    types: itemTypeIds.map(function (id) {
      return gqlItemTypeName(entitiesRepo.findEntity('item_type', id));
    })
  })];
};

var findAll = function findAll(document, predicate) {
  var result = [];
  visit(document, predicate, function (node) {
    result.push(node);
  });
  return result;
};

module.exports = function (_ref) {
  var parentItemType = _ref.parentItemType,
      field = _ref.field,
      schema = _ref.schema,
      gqlItemTypeName = _ref.gqlItemTypeName,
      entitiesRepo = _ref.entitiesRepo,
      generateType = _ref.generateType;
  var parentItemTypeName = gqlItemTypeName(parentItemType);
  var fieldTypeName = "DatoCms".concat(parentItemTypeName).concat(pascalize(field.apiKey), "StructuredText");

  var _buildFor = buildFor("".concat(fieldTypeName, "Blocks"), field.validators.structuredTextBlocks.itemTypes, entitiesRepo, gqlItemTypeName, schema),
      _buildFor2 = _slicedToArray(_buildFor, 2),
      blockFieldTypeName = _buildFor2[0],
      blockFieldType = _buildFor2[1];

  var _buildFor3 = buildFor("".concat(fieldTypeName, "Links"), field.validators.structuredTextLinks.itemTypes, entitiesRepo, gqlItemTypeName, schema),
      _buildFor4 = _slicedToArray(_buildFor3, 2),
      linkFieldTypeName = _buildFor4[0],
      linkFieldType = _buildFor4[1];

  return {
    type: fieldTypeName,
    additionalTypesToCreate: [blockFieldType, linkFieldType, schema.buildObjectType({
      name: fieldTypeName,
      extensions: {
        infer: false
      },
      fields: {
        value: 'JSON',
        blocks: "[".concat(blockFieldTypeName, "]"),
        links: "[".concat(linkFieldTypeName, "]")
      }
    })].filter(function (x) {
      return !!x;
    }),
    resolveForSimpleField: function resolveForSimpleField(fieldValue, context, gqlNode) {
      var linkedItemIds = fieldValue ? uniq(findAll(fieldValue.document, [isInlineItem, isItemLink]).map(function (node) {
        return itemNodeId(node.item, gqlNode.locale, entitiesRepo, generateType);
      })) : [];
      var blockIds = fieldValue ? uniq(findAll(fieldValue.document, isBlock).map(function (node) {
        return itemNodeId(node.item, gqlNode.locale, entitiesRepo, generateType);
      })) : [];
      return {
        value: fieldValue,
        blocks: context.nodeModel.getNodesByIds({
          ids: blockIds
        }),
        links: context.nodeModel.getNodesByIds({
          ids: linkedItemIds
        })
      };
    }
  };
};