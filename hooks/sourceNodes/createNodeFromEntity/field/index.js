"use strict";

var buildNode = require('../utils/buildNode');

var attributes = ['label', 'fieldType', 'apiKey', 'localized', 'validators', 'position', 'appeareance', 'defaultValue'];

module.exports = function buildFieldNode(entity, _ref) {
  var generateType = _ref.generateType;
  return buildNode(generateType('Field'), entity.id, function (node) {
    attributes.forEach(function (attribute) {
      node[attribute] = entity[attribute];
    });
    node.originalId = entity.id;
  });
};