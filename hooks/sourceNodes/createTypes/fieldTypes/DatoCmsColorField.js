"use strict";

var toHex = require('../utils/toHex');

module.exports = function (_ref) {
  var actions = _ref.actions,
      schema = _ref.schema;
  actions.createTypes([schema.buildObjectType({
    name: 'DatoCmsColorField',
    extensions: {
      infer: false
    },
    fields: {
      red: 'Int',
      green: 'Int',
      blue: 'Int',
      alpha: 'Int',
      rgb: {
        type: 'String',
        resolve: function resolve(parent) {
          if (parent.alpha === 255) {
            return "rgb(".concat(parent.red, ", ").concat(parent.green, ", ").concat(parent.blue, ")");
          }

          return "rgba(".concat(parent.red, ", ").concat(parent.green, ", ").concat(parent.blue, ", ").concat(parent.alpha, ")");
        }
      },
      hex: {
        type: 'String',
        resolve: toHex
      }
    }
  })]);
};