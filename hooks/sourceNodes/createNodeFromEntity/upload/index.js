"use strict";

var buildNode = require('../utils/buildNode');

module.exports = function buildUploadNode(entity, _ref) {
  var entitiesRepo = _ref.entitiesRepo,
      generateType = _ref.generateType;
  var siteEntity = entitiesRepo.findEntitiesOfType('site')[0];
  var imgixHost = "https://".concat(siteEntity.imgixHost);
  return buildNode(generateType('Asset'), entity.id, function (node) {
    node.entityPayload = entity.payload;
    node.imgixHost = imgixHost;
    node.digest = entity.path + entity.updatedAt;
  });
};