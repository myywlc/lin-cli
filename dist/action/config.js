"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = exports.cmd = exports.name = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _handleRC = require("../utils/handleRC");

var name = 'config';
exports.name = name;
var cmd = {
  description: 'config .linrc',
  usages: ['lin config set <k> <v>', 'lin config get <k>', 'lin config remove <k>']
};
exports.cmd = cmd;

var handle = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(action, key, value) {
    var result, obj;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = action;
            _context.next = _context.t0 === 'get' ? 3 : _context.t0 === 'set' ? 15 : _context.t0 === 'remove' ? 17 : 19;
            break;

          case 3:
            if (!key) {
              _context.next = 10;
              break;
            }

            _context.next = 6;
            return (0, _handleRC.get)(key);

          case 6:
            result = _context.sent;
            console.log(result);
            _context.next = 14;
            break;

          case 10:
            _context.next = 12;
            return (0, _handleRC.getAll)();

          case 12:
            obj = _context.sent;
            Object.keys(obj).forEach(function (key) {
              console.log("".concat(key, "=").concat(obj[key]));
            });

          case 14:
            return _context.abrupt("break", 20);

          case 15:
            (0, _handleRC.set)(key, value);
            return _context.abrupt("break", 20);

          case 17:
            (0, _handleRC.remove)(key);
            return _context.abrupt("break", 20);

          case 19:
            return _context.abrupt("break", 20);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handle(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.handle = handle;