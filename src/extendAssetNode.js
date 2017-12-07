const { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLEnumType } = require('graphql');
const GraphQLJSONType = require('graphql-type-json');
const base64Img = require(`base64-img`);
const queryString = require(`query-string`);

const isImage = ({ format, width, height }) => (
  ['png', 'jpg', 'jpeg', 'gif'].includes(format) && width && height
);

const createUrl = function() {
  const image = arguments[0];
  const options = Object.assign.apply(
    null,
    [{}].concat(Array.prototype.slice.call(arguments, 1))
  );
  return `${image.url}?${queryString.stringify(options)}`;
}

const getBase64Image = (image) => {
  const requestUrl = `${image.url}?w=20`;

  return new Promise(resolve => {
    base64Img.requestBase64(requestUrl, (a, b, body) => {
      resolve(body);
    });
  });
}

const getBase64ImageAndBasicMeasurements = (image, args) => (
  getBase64Image(image).then(base64Str => {
    let aspectRatio;

    if (args.width && args.height) {
      aspectRatio = args.width / args.height;
    } else {
      aspectRatio = image.width / image.height;
    }

    return {
      base64Str,
      aspectRatio,
      width: image.width,
      height: image.height,
    };
  })
);

const resolveResolution = (image, options) => {
  if (!isImage(image)) return null;

  return getBase64ImageAndBasicMeasurements(image, options).then(
    ({ base64Str, width, height, aspectRatio }) => {
      let desiredAspectRatio = aspectRatio;

      // If we're cropping, calculate the specified aspect ratio.
      if (options.height) {
        desiredAspectRatio = options.width / options.height;
      }

      if (options.height) {
        if (!options.imgixParams || !options.imgixParams.fit) {
          options.imgixParams = Object.assign(options.imgixParams || {}, { fit: 'crop' });
        }
      }

      // Create sizes (in width) for the image. If the width of the
      // image is 800px, the sizes would then be: 800, 1200, 1600,
      // 2400.
      //
      // This is enough sizes to provide close to the optimal image size for every
      // device size / screen resolution
      let sizes = [];
      sizes.push(options.width);
      sizes.push(options.width * 1.5);
      sizes.push(options.width * 2);
      sizes.push(options.width * 3);
      sizes = sizes.map(Math.round);

      // Create the srcSet
      const srcSet = sizes
      .filter(size => size < width)
      .map((size, i) => {
        let resolution
        switch (i) {
          case 0:
            resolution = `1x`
          break
          case 1:
            resolution = `1.5x`
          break
          case 2:
            resolution = `2x`
          break
          case 3:
            resolution = `3x`
          break
          default:
        }
          const h = Math.round(size / desiredAspectRatio);
          const url = createUrl(image, options.imgixParams, { w: size, h: h });
          return `${url} ${resolution}`;
      })
      .join(`,\n`);

      let pickedHeight;

      if (options.height) {
        pickedHeight = options.height;
      } else {
        pickedHeight = options.width / desiredAspectRatio;
      }

      return {
        base64: base64Str,
        aspectRatio: aspectRatio,
        width: Math.round(options.width),
        height: Math.round(pickedHeight),
        src: createUrl(image, options.imgixParams, { w: options.width }),
        srcSet,
      };
    }
  );
}

const resolveSizes = (image, options) => {
  if (!isImage(image)) return null;

  return getBase64ImageAndBasicMeasurements(image, options).then(
    ({ base64Str, width, height, aspectRatio }) => {
      let desiredAspectRatio = aspectRatio;

      // If we're cropping, calculate the specified aspect ratio.
      if (options.maxHeight) {
        desiredAspectRatio = options.maxWidth / options.maxHeight;
      }

      // If the users didn't set a default sizes, we'll make one.
      if (!options.sizes) {
        options.sizes = `(max-width: ${options.maxWidth}px) 100vw, ${options.maxWidth}px`;
      }

      // Create sizes (in width) for the image. If the max width of the container
      // for the rendered markdown file is 800px, the sizes would then be: 200,
      // 400, 800, 1200, 1600, 2400.
      //
      // This is enough sizes to provide close to the optimal image size for every
      // device size / screen resolution
      let sizes = [];
      sizes.push(options.maxWidth / 4);
      sizes.push(options.maxWidth / 2);
      sizes.push(options.maxWidth);
      sizes.push(options.maxWidth * 1.5);
      sizes.push(options.maxWidth * 2);
      sizes.push(options.maxWidth * 3);
      sizes = sizes.map(Math.round);

      // Filter out sizes larger than the image's maxWidth.
      const filteredSizes = sizes.filter(size => size < width)

      // Add the original image to ensure the largest image possible
      // is available for small images.
      filteredSizes.push(width)

      // Create the srcSet.
      const srcSet = filteredSizes
        .map(width => {
          const h = Math.round(width / desiredAspectRatio);
          const url = createUrl(image, options.imgixParams, { w: width, h });
          return `${url} ${Math.round(width)}w`;
        })
        .join(`,\n`);

      return {
        base64: base64Str,
        aspectRatio: aspectRatio,
        src: createUrl(image, options.imgixParams, { w: options.maxWidth, h: options.maxHeight }),
        srcSet,
        sizes: options.sizes,
      };
    }
  );
}

const resolveResize = (image, options) => {
  if (!isImage(image)) return null;

  return getBase64ImageAndBasicMeasurements(image, options).then(
    ({ base64Str, width, height, aspectRatio }) => {

      // If the user selected a height (so cropping) and fit option
      // is not set, we'll set our defaults
      if (options.height) {
        if (!options.imgixParams || !options.imgixParams.fit) {
          options.imgixParams = Object.assign(options.imgixParams || {}, { fit: 'crop' });
        }
      }

      if (options.base64) {
        return base64Str;
      }

      const pickedWidth = options.width;
      let pickedHeight;

      if (options.height) {
        pickedHeight = options.height;
      } else {
        pickedHeight = Math.round(pickedWidth / aspectRatio);
      }

      return {
        src: createUrl(image, options.imgixParams, { w: pickedWidth, h: pickedHeight }),
        width: pickedWidth,
        height: pickedHeight,
        aspectRatio,
        base64: base64Str,
      };
    }
  );
}

module.exports = function extendAssetNode() {
  return {
    resolutions: {
      type: new GraphQLObjectType({
        name: `DatoCmsResolutions`,
        fields: {
          base64: { type: GraphQLString },
          aspectRatio: { type: GraphQLFloat },
          width: { type: GraphQLFloat },
          height: { type: GraphQLFloat },
          src: { type: GraphQLString },
          srcSet: { type: GraphQLString },
        },
      }),
      args: {
        width: {
          type: GraphQLInt,
          defaultValue: 400,
        },
        height: {
          type: GraphQLInt,
        },
        imgixParams: {
          type: GraphQLJSONType,
        },
      },
      resolve(image, options, context) {
        return resolveResolution(image, options);
      },
    },
    sizes: {
      type: new GraphQLObjectType({
        name: `DatoCmsSizes`,
        fields: {
          base64: { type: GraphQLString },
          aspectRatio: { type: GraphQLFloat },
          src: { type: GraphQLString },
          srcSet: { type: GraphQLString },
          sizes: { type: GraphQLString },
        },
      }),
      args: {
        maxWidth: {
          type: GraphQLInt,
          defaultValue: 800,
        },
        maxHeight: {
          type: GraphQLInt,
        },
        sizes: {
          type: GraphQLString,
        },
        imgixParams: {
          type: GraphQLJSONType,
        },
      },
      resolve(image, options, context) {
        return resolveSizes(image, options)
      },
    },
    resize: {
      type: new GraphQLObjectType({
        name: `DatoCmsResize`,
        fields: {
          src: { type: GraphQLString },
          width: { type: GraphQLInt },
          height: { type: GraphQLInt },
          aspectRatio: { type: GraphQLFloat },
        },
      }),
      args: {
        width: {
          type: GraphQLInt,
          defaultValue: 400,
        },
        height: {
          type: GraphQLInt,
        },
        base64: {
          type: GraphQLBoolean,
          defaultValue: false,
        },
        imgixParams: {
          type: GraphQLJSONType,
        },
      },
      resolve(image, options, context) {
        return resolveResize(image, options)
      },
    },
  };
}
