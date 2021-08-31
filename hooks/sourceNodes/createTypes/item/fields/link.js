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
  var itemTypeIds = field.validators.itemItemType.itemTypes;

  if (itemTypeIds.length === 0) {
    return {
      type: 'String'
    };
  }

  if (itemTypeIds.length === 1) {
    var linkedItemType = entitiesRepo.findEntity('item_type', itemTypeIds[0]);
    return {
      type: gqlItemTypeName(linkedItemType),
      resolveForSimpleField: function resolveForSimpleField(fieldValue, context, node) {
        if (fieldValue) {
          return context.nodeModel.getNodeById({
            id: itemNodeId(fieldValue, node.locale, entitiesRepo, generateType)
          });
        }
      }
    };
  }

  var unionType = "DatoCmsUnionFor".concat(parentItemTypeName).concat(pascalize(field.apiKey));
  var unionTypes = itemTypeIds.map(function (id) {
    return gqlItemTypeName(entitiesRepo.findEntity('item_type', id));
  });
  return {
    additionalTypesToCreate: [schema.buildUnionType({
      name: unionType,
      types: unionTypes
    })],
    type: unionType,
    resolveForSimpleField: function resolveForSimpleField(fieldValue, context, node) {
      if (fieldValue) {
        return context.nodeModel.getNodeById({
          id: itemNodeId(fieldValue, node.locale, entitiesRepo, generateType)
        });
      }
    }
  };
};