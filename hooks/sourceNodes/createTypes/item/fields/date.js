"use strict";

module.exports = function () {
  return {
    type: 'Date',
    extensions: {
      dateformat: {},
      proxy: {}
    },
    resolveForSimpleField: function resolveForSimpleField(value) {
      return value;
    }
  };
};