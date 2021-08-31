"use strict";

var _require = require('humps'),
    pascalize = _require.pascalize;

var itemNodeId = require('../../utils/itemNodeId');

module.exports = function (_ref) {
  var parentItemType = _ref.parentItemType,
      field = _ref.field,
      schema = _ref.schema,
      gqlItemTypeName = _ref.gqlItemTypeName,
      entitiesRepo = _ref.entitiesRepo,
      generateType = _ref.generateType;
  var parentItemTypeName = gqlItemTypeName(parentItemType);
  var itemTypeIds = field.validators[field.fieldType === 'rich_text' ? 'richTextBlocks' : 'itemsItemType'].itemTypes;

  if (itemTypeIds.length === 0) {
    return {
      type: 'String'
    };
  }

  if (itemTypeIds.length === 1) {
    var linkedItemType = entitiesRepo.findEntity('item_type', itemTypeIds[0]);
    return {
      type: "[".concat(gqlItemTypeName(linkedItemType), "]"),
      resolveForSimpleField: function resolveForSimpleField(fieldValue, context, node) {
        var ids = (fieldValue || []).map(function (id) {
          return itemNodeId(id, node.locale, entitiesRepo, generateType);
        });
        return context.nodeModel.getNodesByIds({
          ids: ids
        });
      }
    };
  }

  var unionType = "DatoCmsUnionFor".concat(parentItemTypeName).concat(pascalize(field.apiKey));
  return {
    additionalTypesToCreate: [schema.buildUnionType({
      name: unionType,
      types: itemTypeIds.map(function (id) {
        return gqlItemTypeName(entitiesRepo.findEntity('item_type', id));
      })
    })],
    type: "[".concat(unionType, "]"),
    resolveForSimpleField: function resolveForSimpleField(fieldValue, context, node) {
      var ids = (fieldValue || []).map(function (id) {
        return itemNodeId(id, node.locale, entitiesRepo, generateType);
      });
      return context.nodeModel.getNodesByIds({
        ids: ids
      });
    }
  };
};