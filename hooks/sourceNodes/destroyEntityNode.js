"use strict";

var _require = require('humps'),
    pascalize = _require.pascalize;

var _require2 = require("gatsby/package.json"),
    gatsbyVersion = _require2.version;

var gatsbyVersion2 = gatsbyVersion.split('.')[0] === '2';
var ENTITY_TO_NODE_IDS = {
  item_type: function item_type(entity, _ref) {
    var generateType = _ref.generateType;
    return generateType("Model-".concat(entity.id));
  },
  field: function field(entity, _ref2) {
    var generateType = _ref2.generateType;
    return generateType("Field-".concat(entity.id));
  },
  upload: function upload(entity, _ref3) {
    var generateType = _ref3.generateType;
    return generateType("Asset-".concat(entity.id));
  },
  item: function item(entity, _ref4) {
    var entitiesRepo = _ref4.entitiesRepo,
        generateType = _ref4.generateType;
    var siteEntity = entitiesRepo.findEntitiesOfType('site')[0];
    var type = pascalize(entity.itemType.apiKey);
    return siteEntity.locales.map(function (locale) {
      return generateType("".concat(type, "-").concat(entity.id, "-").concat(locale));
    });
  },
  site: function site(entity, _ref5) {
    var generateType = _ref5.generateType;
    return entity.locales.map(function (locale) {
      return generateType("Site-".concat(entity.id, "-").concat(locale));
    });
  }
};

module.exports = function (entity, context) {
  if (!ENTITY_TO_NODE_IDS[entity.type]) {
    console.log("Don't know how to delete entity of type '".concat(entity.type, "'!"));
    return;
  }

  var result = ENTITY_TO_NODE_IDS[entity.type](entity, context);
  var nodeIdsToDelete = Array.isArray(result) ? result : [result];
  nodeIdsToDelete.map(function (nodeId) {
    var node = context.getNode(nodeId);

    if (node) {
      context.actions.deleteNode(gatsbyVersion2 ? {
        node: node
      } : node);
    }
  });
};