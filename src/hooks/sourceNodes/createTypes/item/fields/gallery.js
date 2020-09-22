const { camelize, camelizeKeys } = require('humps');

module.exports = ({
  parentItemType,
  field,
  schema,
  gqlItemTypeName,
  entitiesRepo,
}) => {
  const fieldKey = camelize(field.apiKey);

  return {
    fieldType: {
      type: '[DatoCmsFileField]',
      allLocalesResolver: parent => parent.value,
      normalResolver: parent => parent[fieldKey],
      resolveFromValue: (fileObjects, args, context) => {
        if (!fileObjects) {
          return null;
        }

        return fileObjects.map(fileObject => {
          const upload = context.nodeModel.getNodeById({
            id: fileObject.uploadId___NODE,
          });
          const defaults = upload.entityPayload.attributes.default_field_metadata[fileObject.locale];

          return {
            ...upload,
            alt: fileObject.alt || defaults.alt,
            title: fileObject.title || defaults.title,
            customData: { ...camelizeKeys(defaults.customData), ...fileObject.customData },
          };
        });
      },
    },
  };
};
