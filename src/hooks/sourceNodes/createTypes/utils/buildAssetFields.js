const buildFluidFields = require('../utils/buildFluidFields');
const buildFixedFields = require('../utils/buildFixedFields');

const resolveUsingEntityPayloadAttribute = (key, definition) => ({
  ...definition,
  resolve: node => {
    return node.entityPayload.attributes[key]
  },
});

module.exports = function() {
  return {
    size: resolveUsingEntityPayloadAttribute('size', { type: 'Int' }),
    width: resolveUsingEntityPayloadAttribute('width', { type: 'Int' }),
    height: resolveUsingEntityPayloadAttribute('height', { type: 'Int' }),
    path: resolveUsingEntityPayloadAttribute('path', { type: 'String' }),
    format: resolveUsingEntityPayloadAttribute('format', { type: 'String' }),
    isImage: resolveUsingEntityPayloadAttribute('isImage', { type: 'Boolean' }),
    notes: resolveUsingEntityPayloadAttribute('notes', { type: 'String' }),
    author: resolveUsingEntityPayloadAttribute('author', { type: 'String' }),
    copyright: resolveUsingEntityPayloadAttribute('copyright', {
      type: 'String',
    }),
    tags: resolveUsingEntityPayloadAttribute('tags', { type: '[String]' }),
    smartTags: resolveUsingEntityPayloadAttribute('smartTags', {
      type: '[String]',
    }),
    filename: resolveUsingEntityPayloadAttribute('filename', {
      type: 'String',
    }),
    basename: resolveUsingEntityPayloadAttribute('basename', {
      type: 'String',
    }),
    exifInfo: resolveUsingEntityPayloadAttribute('exifInfo', { type: 'JSON' }),
    mimeType: resolveUsingEntityPayloadAttribute('mimeType', {
      type: 'String',
    }),
    colors: resolveUsingEntityPayloadAttribute('colors', {
      type: '[DatoCmsColorField]',
    }),
    blurhash: resolveUsingEntityPayloadAttribute('blurhash', {
      type: 'String',
    }),
    originalId: { type: 'String', resolve: node => node.entityPayload.id },
    url: {
      type: 'String',
      resolve: node => {
        return `${node.imgixHost}${node.entityPayload.attributes.path}`;
      },
    },
    createdAt: resolveUsingEntityPayloadAttribute('createdAt', {
      type: 'Date',
      extensions: { dateformat: {} },
    }),
    video: {
      type: 'DatoCmsAssetVideo',
      resolve: upload => {
        if (upload.entityPayload.attributes.muxPlaybackId) {
          return upload;
        }

        return null;
      },
    },
    ...buildFluidFields(),
    ...buildFixedFields(),
  };
};
