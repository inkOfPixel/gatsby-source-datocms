const { pascalize } = require('humps');
const { camelize } = require('datocms-client');
const { localizedRead } = require('datocms-client');
const entries = require('object.entries');

const buildNode = require('../utils/buildNode');
const buildSeoMetaTagsNode = require('./buildSeoMetaTagsNode');
const itemNodeId = require('./itemNodeId');
const addField = require('./addField');

module.exports = function buildItemNode(
  entity,
  { entitiesRepo, localeFallbacks },
) {
  const siteEntity = entitiesRepo.site;
  const type = pascalize(entity.itemType.apiKey);

  return [].concat(
    ...siteEntity.locales.map(locale => {
      const additionalNodesToCreate = [];
      const i18n = { locale, fallbacks: localeFallbacks };

      const itemNode = buildNode(
        `DatoCms${type}`,
        `${entity.id}-${locale}`,
        node => {
          node.locale = locale;
          node.model___NODE = `DatoCmsModel-${entity.itemType.id}`;
          node.entityPayload = entity.payload;
          node.digest = entity.meta.updatedAt;

          entity.itemType.fields
            .filter(field => field.fieldType === 'text')
            .forEach(field => {
              const camelizedApiKey = camelize(field.apiKey);

              let mediaType = 'text/plain';

              if (field.appeareance.editor === 'markdown') {
                mediaType = 'text/markdown';
              } else if (field.appeareance.editor === 'wysiwyg') {
                mediaType = 'text/html';
              }

              const value = localizedRead(
                entity,
                camelizedApiKey,
                field.localized,
                i18n,
              );

              const textNode = buildNode(
                'DatoCmsTextNode',
                `${node.id}-${camelizedApiKey}`,
                node => {
                  node.internal.mediaType = mediaType;
                  node.internal.content = value || '';
                  node.digest = entity.meta.updatedAt;
                },
              );

              additionalNodesToCreate.push(textNode);

              node[`${camelizedApiKey}Node___NODE`] = textNode.id;
            });

          const seoNode = buildNode('DatoCmsSeoMetaTags', node.id, node => {
            // node.tags = seoTagsBuilder(itemEntity, entitiesRepo, i18n);
            node.digest = entity.meta.updatedAt;
            node.locale = locale;
          });

          additionalNodesToCreate.push(seoNode);
          node.seoMetaTags___NODE = seoNode.id;
        },
      );

      return [itemNode].concat(additionalNodesToCreate);
    }),
  );
};
