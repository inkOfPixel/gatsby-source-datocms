const { suite } = require('uvu');
const buildQueryExecutor = require('./support/buildQueryExecutor');
const assertGraphQLResponseEqualToSnapshot = require('./support/assertGraphQLResponseEqualToSnapshot');

const GraphQL = suite('gatsby-source-datocms');

let executeQuery;

GraphQL.before(async () => {
  executeQuery = await buildQueryExecutor('bb260a9bf12cccf24392dc68209a42');
});

const assetFields = `
    size width height path format isImage notes author copyright tags
    smartTags filename basename exifInfo mimeType blurhash
    originalId url createdAt
    colors { red green blue alpha rgb hex }
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
    fixed(width: 300, imgixParams: {fm: "auto"}) { base64 aspectRatio width height src srcSet sizes }
    fluid(maxWidth: 300, imgixParams: {fm: "auto"}) { base64 aspectRatio width height src srcSet sizes }
  `;

const fileFields = `alt title customData ${assetFields}`;

GraphQL('assets', async () => {
  assertGraphQLResponseEqualToSnapshot(
    'png-asset',
    await executeQuery(
      `{ datoCmsAsset(originalId: {eq: "2637142"}) { ${assetFields} } }`,
    ),
  );
  assertGraphQLResponseEqualToSnapshot(
    'mp4-asset',
    await executeQuery(
      `{ datoCmsAsset(originalId: {eq: "2637250"}) { ${assetFields} } }`,
    ),
  );
  assertGraphQLResponseEqualToSnapshot(
    'csv-asset',
    await executeQuery(
      `{ datoCmsAsset(originalId: {eq: "2637251"}) { ${assetFields} } }`,
    ),
  );
});

GraphQL('sortable collection', async () => {
  assertGraphQLResponseEqualToSnapshot(
    'sortable-position',
    await executeQuery(`
    {
      datoCmsSecondaryModel(originalId: {eq: "7364459"}) {
        position
      }
    }
  `),
  );
});

GraphQL('tree collections', async () => {
  assertGraphQLResponseEqualToSnapshot(
    'tree',
    await executeQuery(`
      {
        allDatoCmsHierarchical(filter: {root: {eq: true}, locale: {eq: "en"}}) {
          nodes {
            id
            title
            position
            treeChildren {
              id
              title
              position
              treeParent {
                id
                title
              }
              treeChildren {
                id
                title
                position
                treeChildren {
                  id
                  title
                  position
                }
              }
            }
          }
        }
      }
    `),
  );
});

GraphQL('items', async () => {
  const query = `
    {
      enArticle: datoCmsArticle(originalId: {eq: "7364344"}, locale: {eq: "en"}) {
        __typename
        locale
        originalId
        id
        singleLineString
        _allSingleLineStringLocales {
          locale
          value
        }
        multipleParagraphText
        _allMultipleParagraphTextLocales {
          locale
          value
        }
        multipleParagraphTextNode {
          id
          internal {
            content
          }
        }
        singleAsset {
          ${fileFields}
        }
        _allSingleAssetLocales {
          locale
          value {
            ${fileFields}
          }
        }
        assetGallery {
          ${fileFields}
        }
        _allAssetGalleryLocales {
          locale
          value {
            ${fileFields}
          }
        }
        externalVideo {
          __typename
          url
          title
          provider
          providerUid
          thumbnailUrl
          width
          height
        }
        _allExternalVideoLocales {
          locale
          value {
            __typename
            url
            title
            provider
            providerUid
            thumbnailUrl
            width
            height
          }
        }
        date(formatString: "YYYY MMMM DD")
        _allDateLocales {
          locale
          value
        }
        dateTime(formatString: "YYYY MMMM DD @ HH:mm")
        _allDateTimeLocales {
          locale
          value
        }
        integerNumber
        _allIntegerNumberLocales {
          locale
          value
        }
        floatingPointNumber
        _allFloatingPointNumberLocales {
          locale
          value
        }
        boolean
        _allBooleanLocales {
          locale
          value
        }
        location {
          latitude
          longitude
        }
        _allLocationLocales {
          locale
          value {
            __typename
            latitude
            longitude
          }
        }
        color {
          red
          green
          blue
          alpha
          rgb
          hex
        }
        _allColorLocales {
          locale
          value {
            red
            green
            blue
            alpha
            rgb
            hex
          }
        }
        slug
        _allSlugLocales {
          locale
          value
        }
        seo {
          title
          description
          twitterCard
          image {
            path
          }
        }
        _allSeoLocales {
          locale
          value {
            title
            description
            twitterCard
            image {
              path
            }
          }
        }
        singleLink {
          id
          singleLineString
        }
        _allSingleLinkLocales {
          locale
          value {
            id
            singleLineString
          }
        }
        advancedSingleLink {
          __typename
          ... on DatoCmsArticle {
            singleLineString
          }
          ... on DatoCmsSecondaryModel {
            title
          }
        }
        _allAdvancedSingleLinkLocales {
          locale
          value {
            __typename
            ... on DatoCmsArticle {
              singleLineString
            }
            ... on DatoCmsSecondaryModel {
              title
            }
          }
        }
        multipleLinks {
          id
          singleLineString
        }
        _allMultipleLinksLocales {
          locale
          value {
            id
            singleLineString
          }
        }
        advancedMultipleLinks {
          __typename
          ... on DatoCmsArticle {
            singleLineString
          }
          ... on DatoCmsSecondaryModel {
            title
          }
        }
        _allAdvancedMultipleLinksLocales {
          locale
          value {
            __typename
            ... on DatoCmsArticle {
              singleLineString
            }
            ... on DatoCmsSecondaryModel {
              title
            }
          }
        }
        json
        _allJsonLocales {
          locale
          value
        }
        modularContent {
          title
          originalId
        }
        _allModularContentLocales {
          locale
          value {
            title
            originalId
          }
        }
        meta {
          createdAt
          updatedAt
          status
          isValid
          publishedAt
          __typename
        }
        seoMetaTags {
          __typename
          tags
          id
        }
        model {
          id
          name
          singleton
          sortable
          apiKey
          orderingDirection
          tree
          modularBlock
          draftModeActive
          allLocalesRequired
          collectionAppeareance
          hasSingletonItem
          originalId
        }
      }
    }
  `;

  assertGraphQLResponseEqualToSnapshot('item', await executeQuery(query));
});

GraphQL.run();
