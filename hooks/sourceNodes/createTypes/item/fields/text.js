"use strict";

var _require = require('datocms-client'),
    camelize = _require.camelize;

module.exports = function (_ref) {
  var field = _ref.field;
  var fieldKey = camelize(field.apiKey);
  return {
    type: 'String',
    nodeType: 'DatoCmsTextNode',
    resolveForSimpleField: function resolveForSimpleField(fieldValue) {
      return fieldValue;
    },
    resolveForNodeField: function resolveForNodeField(fieldValue, context, node) {
      return context.nodeModel.getNodeById({
        id: "DatoCmsTextNode-".concat(node.id, "-").concat(fieldKey)
      });
    }
  };
};