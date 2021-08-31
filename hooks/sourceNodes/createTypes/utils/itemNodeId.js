"use strict";

var _require = require('humps'),
    pascalize = _require.pascalize;

module.exports = function itemNodeId(id, locale, entitiesRepo, generateType) {
  if (!id) {
    return null;
  }

  var entity = entitiesRepo.findEntity('item', id);

  if (!entity) {
    return null;
  }

  return generateType("".concat(pascalize(entity.itemType.apiKey), "-").concat(entity.id, "-").concat(locale));
};