"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Queue = require('promise-queue');

var fs = require('fs-extra');

var path = require('path');

var md5 = require('md5');

var got = require('got');

var resizeUrl = require('./resizeUrl');

var queryString = require('query-string');

var queue = new Queue(10, Infinity);
var promises = {};

function download(requestUrl, cacheDir) {
  var cacheFile = path.join(cacheDir, md5(requestUrl));

  if (fs.existsSync(cacheFile)) {
    var body = fs.readFileSync(cacheFile, 'utf8');
    return Promise.resolve(body);
  }

  var key = JSON.stringify({
    requestUrl: requestUrl,
    cacheFile: cacheFile
  });

  if (promises[key]) {
    return promises[key];
  }

  promises[key] = queue.add(function () {
    return got(encodeURI(requestUrl), {
      encoding: 'base64',
      retry: {
        limit: 5
      }
    }).then(function (res) {
      var data = 'data:' + res.headers['content-type'] + ';base64,' + res.body;
      fs.writeFileSync(cacheFile, data, 'utf8');
      return data;
    });
  });
  return promises[key];
}

module.exports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, cacheDir) {
    var forceBlurhash, format, src, width, height, _src$split, _src$split2, baseUrl, query, _url, result, imgixParams, url, _result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            forceBlurhash = _ref.forceBlurhash, format = _ref.format, src = _ref.src, width = _ref.width, height = _ref.height;
            _src$split = src.split('?'), _src$split2 = _slicedToArray(_src$split, 2), baseUrl = _src$split2[0], query = _src$split2[1];

            if (!(!baseUrl.startsWith('https://www.datocms-assets.com/') || format === 'png' && !forceBlurhash)) {
              _context.next = 15;
              break;
            }

            _url = resizeUrl({
              url: src,
              width: width,
              height: height
            }, 20);
            _context.prev = 4;
            _context.next = 7;
            return download(_url, cacheDir);

          case 7:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            console.log("Error downloading ".concat(_url, " to generate blurred placeholder!: ").concat(_context.t0.message));
            return _context.abrupt("return", null);

          case 15:
            imgixParams = queryString.parse(query);
            imgixParams.lqip = 'blurhash';
            url = "".concat(baseUrl, "?").concat(queryString.stringify(imgixParams));
            _context.prev = 18;
            _context.next = 21;
            return download(url, cacheDir);

          case 21:
            _result = _context.sent;
            return _context.abrupt("return", _result);

          case 25:
            _context.prev = 25;
            _context.t1 = _context["catch"](18);
            console.log("Error downloading ".concat(url, " to generate Blurhash placeholder!: ").concat(_context.t1.message));
            return _context.abrupt("return", null);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11], [18, 25]]);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();