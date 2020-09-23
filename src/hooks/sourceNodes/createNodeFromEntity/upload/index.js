const buildNode = require('../utils/buildNode');

module.exports = function buildUploadNode(entity, { entitiesRepo }) {
  const siteEntity = entitiesRepo.findEntitiesOfType('site')[0];
  const imgixHost = `https://${siteEntity.imgixHost}`;

  return buildNode('DatoCmsAsset', entity.id, node => {
    console.log(node.id);
    node.entityPayload = entity.payload;
    node.imgixHost = imgixHost;
    node.digest = entity.path + entity.updatedAt;

    // attributes.forEach(attribute => {
    //   node[attribute] = entity[attribute];
    // });
    // node.originalId = entity.id;
    // node.url = `${imgixHost}${entity.path}`;
  });
};
