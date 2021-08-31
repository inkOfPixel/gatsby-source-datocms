"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('humps'),
    camelize = _require.camelize,
    pascalize = _require.pascalize;

var objectAssign = require('object-assign');

var _require2 = require('datocms-client'),
    camelizeKeys = _require2.camelizeKeys,
    localizedRead = _require2.localizedRead;

var simpleField = require('./fields/simpleField');

var simpleFieldReturnCamelizedKeys = require('./fields/simpleFieldReturnCamelizedKeys');

var itemNodeId = require('../utils/itemNodeId');

var fieldResolvers = {
  "boolean": simpleField('Boolean'),
  color: simpleField('DatoCmsColorField'),
  date: require('./fields/date'),
  date_time: require('./fields/date'),
  file: require('./fields/file'),
  "float": simpleField('Float'),
  gallery: require('./fields/gallery'),
  integer: simpleField('Int'),
  json: simpleField('JSON'),
  lat_lon: simpleField('DatoCmsLatLonField'),
  link: require('./fields/link'),
  links: require('./fields/richText'),
  rich_text: require('./fields/richText'),
  structured_text: require('./fields/structuredText'),
  seo: simpleFieldReturnCamelizedKeys('DatoCmsSeoField'),
  slug: simpleField('String'),
  string: simpleField('String'),
  text: require('./fields/text'),
  video: simpleFieldReturnCamelizedKeys('DatoCmsVideoField')
};

module.exports = function (_ref) {
  var entitiesRepo = _ref.entitiesRepo,
      localeFallbacks = _ref.localeFallbacks,
      actions = _ref.actions,
      schema = _ref.schema,
      generateType = _ref.generateType;

  var gqlItemTypeName = function gqlItemTypeName(itemType) {
    return generateType(pascalize(itemType.apiKey));
  };

  entitiesRepo.findEntitiesOfType('item_type').forEach(function (entity) {
    var type = gqlItemTypeName(entity);
    var fields = entity.fields.reduce(function (acc, field) {
      var resolver = fieldResolvers[field.fieldType];

      if (resolver) {
        var _resolver = resolver({
          parentItemType: entity,
          field: field,
          gqlItemTypeName: gqlItemTypeName,
          schema: schema,
          entitiesRepo: entitiesRepo,
          generateType: generateType
        }),
            _resolver$additionalT = _resolver.additionalTypesToCreate,
            additionalTypesToCreate = _resolver$additionalT === void 0 ? [] : _resolver$additionalT,
            _type = _resolver.type,
            nodeType = _resolver.nodeType,
            extensions = _resolver.extensions,
            resolveForSimpleField = _resolver.resolveForSimpleField,
            resolveForNodeField = _resolver.resolveForNodeField;

        actions.createTypes(additionalTypesToCreate);
        objectAssign(acc, _defineProperty({}, camelize(field.apiKey), _objectSpread({
          type: _type
        }, extensions ? {
          extensions: extensions
        } : {}, {
          resolve: function resolve(node, _args, context) {
            var i18n = {
              locale: node.locale,
              fallbacks: localeFallbacks
            };
            var value = localizedRead(node.entityPayload.attributes, field.apiKey, field.localized, i18n);
            return resolveForSimpleField(value, context, node, i18n);
          }
        })));

        if (nodeType) {
          objectAssign(acc, _defineProperty({}, "".concat(camelize(field.apiKey), "Node"), {
            type: nodeType,
            resolve: function resolve(node, args, context) {
              var i18n = {
                locale: node.locale,
                fallbacks: localeFallbacks
              };
              var value = localizedRead(node.entityPayload.attributes, field.apiKey, field.localized, i18n);
              return resolveForNodeField(value, context, node, i18n);
            }
          }));
        }

        if (field.localized) {
          var parentItemTypeName = gqlItemTypeName(entity);
          var allLocalesTypeName = "DatoCmsAllLocalesFor".concat(parentItemTypeName).concat(pascalize(field.apiKey));
          actions.createTypes([schema.buildObjectType({
            name: allLocalesTypeName,
            extensions: {
              infer: false
            },
            fields: _objectSpread({
              locale: 'String',
              value: {
                type: _type,
                resolve: function resolve(node, args, context) {
                  var i18n = {
                    locale: node.locale,
                    fallbacks: localeFallbacks
                  };
                  var value = localizedRead(node.entityPayload.attributes, field.apiKey, field.localized, i18n);
                  return resolveForSimpleField(value, context, node, i18n);
                }
              }
            }, nodeType ? {
              valueNode: {
                type: nodeType,
                resolve: function resolve(node, args, context) {
                  node.id = "".concat(_type, "-").concat(node.entityPayload.id, "-").concat(node.locale);
                  var i18n = {
                    locale: node.locale,
                    fallbacks: localeFallbacks
                  };
                  var value = localizedRead(node.entityPayload.attributes, field.apiKey, field.localized, i18n);
                  return resolveForNodeField(value, context, node, i18n);
                }
              }
            } : {})
          })]);
          objectAssign(acc, _defineProperty({}, "_all".concat(pascalize(field.apiKey), "Locales"), {
            type: "[".concat(allLocalesTypeName, "]"),
            resolve: function resolve(node) {
              var locales = Object.keys(node.entityPayload.attributes[field.apiKey] || {});
              return locales.map(function (locale) {
                return {
                  locale: locale,
                  entityPayload: node.entityPayload
                };
              });
            }
          }));
        }
      }

      return acc;
    }, {});

    if (entity.sortable || entity.tree) {
      objectAssign(fields, {
        position: {
          type: 'Int',
          resolve: function resolve(node) {
            return node.entityPayload.attributes.position;
          }
        }
      });
    }

    if (entity.tree) {
      objectAssign(fields, {
        treeParent: {
          type: type,
          resolve: function resolve(node, args, context) {
            var parentId = node.entityPayload.attributes.parent_id;

            if (parentId) {
              return context.nodeModel.getNodeById({
                id: itemNodeId(parentId, node.locale, entitiesRepo, generateType)
              });
            }
          }
        },
        treeChildren: {
          type: "[".concat(type, "]"),
          resolve: function resolve(node, args, context) {
            var allItems = context.nodeModel.getAllNodes({
              type: type
            });
            var children = allItems.filter(function (otherNode) {
              return otherNode.entityPayload.attributes.parent_id === node.entityPayload.id && otherNode.locale === node.locale;
            });
            return children;
          }
        },
        root: {
          type: 'Boolean',
          resolve: function resolve(node) {
            return !node.entityPayload.attributes.parent_id;
          }
        }
      });
    }

    actions.createTypes([schema.buildObjectType({
      name: type,
      extensions: {
        infer: false
      },
      fields: objectAssign(fields, {
        meta: {
          type: 'DatoCmsMetaField',
          resolve: function resolve(node) {
            return camelizeKeys(node.entityPayload.meta);
          }
        },
        originalId: {
          type: 'String',
          resolve: function resolve(node) {
            return node.entityPayload.id;
          }
        },
        locale: 'String',
        seoMetaTags: {
          type: generateType('SeoMetaTags'),
          resolve: function resolve(node, args, context) {
            return context.nodeModel.getNodeById({
              id: generateType("SeoMetaTags-".concat(node.id))
            });
          }
        },
        model: {
          type: generateType('Model'),
          resolve: function resolve(node, args, context) {
            return context.nodeModel.getNodeById({
              id: generateType("Model-".concat(node.entityPayload.relationships.item_type.data.id))
            });
          }
        }
      }),
      interfaces: ["Node"]
    })]);
  });
};