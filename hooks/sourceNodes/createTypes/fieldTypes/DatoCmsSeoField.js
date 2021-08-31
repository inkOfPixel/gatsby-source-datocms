"use strict";

module.exports = function (_ref) {
  var actions = _ref.actions,
      schema = _ref.schema;
  actions.createTypes([schema.buildObjectType({
    name: 'DatoCmsSeoField',
    extensions: {
      infer: false
    },
    fields: {
      title: 'String',
      description: 'String',
      twitterCard: 'String',
      image: {
        type: 'DatoCmsAsset',
        resolve: function resolve(fieldValue, args, context) {
          if (fieldValue && fieldValue.image) {
            return context.nodeModel.getNodeById({
              id: "DatoCmsAsset-".concat(fieldValue.image)
            });
          }
        }
      }
    }
  })]);
};