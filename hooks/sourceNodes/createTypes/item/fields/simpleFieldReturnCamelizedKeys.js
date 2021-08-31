"use strict";

var _require = require('datocms-client'),
    camelizeKeys = _require.camelizeKeys;

module.exports = function (type) {
  return function () {
    return {
      type: type,
      resolveForSimpleField: function resolveForSimpleField(value) {
        return camelizeKeys(value);
      }
    };
  };
};