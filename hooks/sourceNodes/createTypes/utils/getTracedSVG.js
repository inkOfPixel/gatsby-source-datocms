"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Queue = require('promise-queue');

var fs = require('fs-extra');

var path = require('path');

var md5 = require('md5');

var resizeUrl = require('./resizeUrl');

var got = require('got');

var queue = new Queue(10, Infinity);
var promises = {};

function download(requestUrl, cacheDir) {
  var cacheFile = path.join(cacheDir, md5(requestUrl));

  if (fs.existsSync(cacheFile)) {
    return Promise.resolve(cacheFile);
  }

  var key = JSON.stringify({
    requestUrl: requestUrl,
    cacheFile: cacheFile
  });

  if (promises[key]) {
    return promises[key];
  }

  promises[key] = queue.add(function () {
    return got(requestUrl, {
      responseType: 'buffer',
      maxRedirects: 10,
      retry: {
        limit: 5
      }
    }).then(function (response) {
      fs.writeFileSync(cacheFile, response.body);
      return cacheFile;
    });
  });
  return promises[key];
}

module.exports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, cacheDir) {
    var src, width, height, _require, traceSVG, absolutePath, url, name, result, content;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            src = _ref.src, width = _ref.width, height = _ref.height;
            _require = require("gatsby-plugin-sharp"), traceSVG = _require.traceSVG;
            url = resizeUrl({
              url: src,
              width: width,
              height: height
            }, 80);
            _context.prev = 3;
            _context.next = 6;
            return download(url, cacheDir);

          case 6:
            absolutePath = _context.sent;
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            console.log("Error downloading ".concat(url, " to generate traced SVG!: ").concat(_context.t0.message));
            return _context.abrupt("return", null);

          case 13:
            name = path.basename(absolutePath);
            _context.prev = 14;
            _context.next = 17;
            return traceSVG({
              file: {
                internal: {
                  contentDigest: md5(absolutePath)
                },
                name: name,
                extension: 'png',
                absolutePath: absolutePath
              },
              args: {
                toFormat: ''
              },
              fileArgs: {}
            });

          case 17:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 21:
            _context.prev = 21;
            _context.t1 = _context["catch"](14);
            content = fs.readFileSync(absolutePath, {
              encoding: 'base64'
            });
            console.log("Error generating traced SVG for \"".concat(url, "\": ").concat(_context.t1.message, ". Local file: ").concat(absolutePath, ", content: \"").concat(content, "\""));
            return _context.abrupt("return", null);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 9], [14, 21]]);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();