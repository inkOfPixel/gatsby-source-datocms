"use strict";

require('core-js/stable');

require('regenerator-runtime/runtime');

var onPreInit = require('./hooks/onPreInit');

exports.onPreInit = onPreInit;

var createSchemaCustomization = require('./hooks/createSchemaCustomization');

exports.createSchemaCustomization = createSchemaCustomization;

var sourceNodes = require('./hooks/sourceNodes');

exports.sourceNodes = sourceNodes;