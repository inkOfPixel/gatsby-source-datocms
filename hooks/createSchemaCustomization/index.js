"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs-extra');

var _require = require('humps'),
    pascalize = _require.pascalize;

var createNodeFromEntity = require('../sourceNodes/createNodeFromEntity');

var destroyEntityNode = require('../sourceNodes/destroyEntityNode');

var createTypes = require('../sourceNodes/createTypes');

var _require2 = require('../onPreInit/errorMap'),
    prefixId = _require2.prefixId,
    CODES = _require2.CODES;

var _require3 = require('../../utils'),
    getLoader = _require3.getLoader;

module.exports = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
    var actions, getNode, getNodesByType, reporter, parentSpan, schema, store, apiToken, previewMode, environment, apiUrl, instancePrefix, rawLocaleFallbacks, localeFallbacks, errorText, loader, program, cacheDir, context, activity, removeUpsertListener, removeDestroyListener;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actions = _ref.actions, getNode = _ref.getNode, getNodesByType = _ref.getNodesByType, reporter = _ref.reporter, parentSpan = _ref.parentSpan, schema = _ref.schema, store = _ref.store;
            apiToken = _ref2.apiToken, previewMode = _ref2.previewMode, environment = _ref2.environment, apiUrl = _ref2.apiUrl, instancePrefix = _ref2.instancePrefix, rawLocaleFallbacks = _ref2.localeFallbacks;
            localeFallbacks = rawLocaleFallbacks || {};

            if (!apiToken) {
              errorText = "API token must be provided!";
              reporter.panic({
                id: prefixId(CODES.MissingAPIToken),
                context: {
                  sourceMessage: errorText
                }
              }, new Error(errorText));
            }

            if (process.env.GATSBY_IS_PREVIEW === "true") {
              previewMode = true;
            }

            loader = getLoader({
              apiToken: apiToken,
              previewMode: previewMode,
              environment: environment,
              apiUrl: apiUrl
            });
            program = store.getState().program;
            cacheDir = "".concat(program.directory, "/.cache/datocms-assets");

            if (!fs.existsSync(cacheDir)) {
              fs.mkdirSync(cacheDir);
            }

            context = {
              entitiesRepo: loader.entitiesRepo,
              actions: actions,
              getNode: getNode,
              getNodesByType: getNodesByType,
              localeFallbacks: localeFallbacks,
              schema: schema,
              store: store,
              cacheDir: cacheDir,
              generateType: function generateType(type) {
                return "DatoCms".concat(instancePrefix ? pascalize(instancePrefix) : '').concat(type);
              }
            };
            activity = reporter.activityTimer("loading DatoCMS schema", {
              parentSpan: parentSpan
            });
            activity.start();
            removeUpsertListener = loader.entitiesRepo.addUpsertListener(function (entity) {
              createNodeFromEntity(entity, context);
            });
            removeDestroyListener = loader.entitiesRepo.addDestroyListener(function (entity) {
              destroyEntityNode(entity, context);
            });
            _context.next = 16;
            return loader.loadSchemaWithinEnvironment();

          case 16:
            removeUpsertListener();
            removeDestroyListener();
            activity.end();
            createTypes(context);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();