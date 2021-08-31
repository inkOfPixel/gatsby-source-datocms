"use strict";

var crypto = require('crypto');

var stringify = require('json-stringify-safe');

module.exports = function updateDigest(node) {
  delete node.internal.owner;
  var digest = node.digest;
  delete node.digest;
  node.internal.contentDigest = digest || crypto.createHash('md5').update(stringify(node)).digest('hex');
  return node;
};