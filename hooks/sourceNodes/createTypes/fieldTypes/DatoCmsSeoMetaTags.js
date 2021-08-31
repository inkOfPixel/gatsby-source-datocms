"use strict";

var _require = require('datocms-client'),
    seoTagsBuilder = _require.seoTagsBuilder,
    JsonApiEntity = _require.JsonApiEntity;

module.exports = function (_ref) {
  var entitiesRepo = _ref.entitiesRepo,
      actions = _ref.actions,
      schema = _ref.schema,
      localeFallbacks = _ref.localeFallbacks,
      generateType = _ref.generateType;
  actions.createTypes([schema.buildObjectType({
    name: generateType('SeoMetaTags'),
    extensions: {
      infer: false
    },
    fields: {
      tags: {
        type: 'JSON',
        resolve: function resolve(node, args, context) {
          var i18n = {
            locale: node.locale,
            localeFallbacks: localeFallbacks
          };
          var item = context.nodeModel.getNodeById({
            id: node.itemNodeId
          });
          return seoTagsBuilder(new JsonApiEntity(item.entityPayload, entitiesRepo), entitiesRepo, i18n);
        }
      }
    },
    interfaces: ["Node"]
  })]);
};