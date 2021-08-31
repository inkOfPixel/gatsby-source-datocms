"use strict";

var buildNode = require('../utils/buildNode');

var attributes = ['name', 'singleton', 'sortable', 'apiKey', 'orderingDirection', 'tree', 'modularBlock', 'draftModeActive', 'allLocalesRequired', 'collectionAppeareance', 'hasSingletonItem'];

module.exports = function buildItemTypeNode(entity, _ref) {
  var generateType = _ref.generateType;
  return buildNode(generateType('Model'), entity.id, function (node) {
    attributes.forEach(function (attribute) {
      node[attribute] = entity[attribute];
    });
    node.originalId = entity.id;
    node.fields___NODE = entity.fields.map(function (field) {
      return "DatoCmsField-".concat(field.id);
    });
  });
};