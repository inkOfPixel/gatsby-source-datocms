"use strict";

module.exports = function toHex(parent) {
  var rgba = ['red', 'green', 'blue', 'alpha'].map(function (component) {
    var hex = parent[component].toString(16);
    return hex.length === 1 ? "0".concat(hex) : hex;
  });
  return rgba[3] === 'ff' ? "#".concat(rgba.slice(0, 3).join('')) : "#".concat(rgba.join(''));
};