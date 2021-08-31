"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('datocms-client'),
    SiteClient = _require.SiteClient,
    Loader = _require.Loader;

var CLIENT_HEADERS = {
  'X-Reason': 'dump',
  'X-SSG': 'gatsby'
};
var GATSBY_CLOUD = process.env.GATSBY_CLOUD;
var GATSBY_EXECUTING_COMMAND = process.env.gatsby_executing_command;
var clients = {};
var loaders = {};

function getClient(options) {
  var apiToken = options.apiToken,
      apiUrl = options.apiUrl,
      environment = options.environment;
  var key = JSON.stringify({
    apiToken: apiToken,
    apiUrl: apiUrl,
    environment: environment
  });

  if (clients[key]) {
    return clients[key];
  }

  var client = apiUrl ? new SiteClient(apiToken, _objectSpread({}, CLIENT_HEADERS, {
    environment: environment
  }), apiUrl) : new SiteClient(apiToken, _objectSpread({}, CLIENT_HEADERS, {
    environment: environment
  }));
  clients[key] = client;
  return client;
}

function getLoader(options) {
  var apiToken = options.apiToken,
      apiUrl = options.apiUrl,
      previewMode = options.previewMode,
      environment = options.environment;
  var key = JSON.stringify({
    apiToken: apiToken,
    apiUrl: apiUrl,
    previewMode: previewMode,
    environment: environment
  });

  if (loaders[key]) {
    return loaders[key];
  }

  var loader = new Loader(getClient({
    apiToken: apiToken,
    apiUrl: apiUrl,
    environment: environment
  }), GATSBY_CLOUD && GATSBY_EXECUTING_COMMAND === 'develop' || previewMode, environment);
  loaders[key] = loader;
  return loader;
}

module.exports = {
  getClient: getClient,
  getLoader: getLoader
};