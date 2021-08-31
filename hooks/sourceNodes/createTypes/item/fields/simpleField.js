"use strict";

module.exports = function (type) {
  return function () {
    return {
      type: type,
      resolveForSimpleField: function resolveForSimpleField(value) {
        return value;
      }
    };
  };
};