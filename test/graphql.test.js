const { suite } = require('uvu');
const assert = require('uvu/assert');
const buildQueryExecutor = require('./support/buildQueryExecutor');
const assertGraphQLResponseEqualToSnapshot = require('./support/assertGraphQLResponseEqualToSnapshot');

const GraphQL = suite('gatsby-source-datocms');

let executeQuery;

GraphQL.before(async () => {
  executeQuery = await buildQueryExecutor();
});

GraphQL('assets', async () => {
  const result = await executeQuery(
    `{
      datoCmsAsset(originalId: {eq: "2637142"}) {
        size
        width
        height
        path
        format
        isImage
        notes
        author
        copyright
        tags
        smartTags
        filename
        basename
        exifInfo
        mimeType
        colors {
          red
          green
          blue
          alpha
          rgb
          hex
        }
        blurhash
        originalId
        url
        createdAt
        video {
          muxPlaybackId
          frameRate
          duration
          streamingUrl
          gifThumbnailUrl: thumbnailUrl(format: gif)
          jpgThumbnailUrl: thumbnailUrl(format: jpg)
          pngThumbnailUrl: thumbnailUrl(format: png)
          lowMp4Url: mp4Url(exactRes: low)
          mediumMp4Url: mp4Url(exactRes: medium)
          highMp4Url: mp4Url(exactRes: high)
        }
        fixed(width: 300, imgixParams: {fm: "auto"}) {
          base64
          aspectRatio
          width
          height
          src
          srcSet
          sizes
        }
        fluid(maxWidth: 300, imgixParams: {fm: "auto"}) {
          base64
          aspectRatio
          width
          height
          src
          srcSet
          sizes
        }
      }
    }
    `,
  );

  assertGraphQLResponseEqualToSnapshot('png-asset', result);
});

GraphQL.run();
