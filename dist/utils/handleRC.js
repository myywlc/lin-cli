"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.set = exports.getAll = exports.get = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _base = require("./base");

var _ini = require("ini");

var _util = require("util");

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var readFile = (0, _util.promisify)(_fs.default.readFile);
var writeFile = (0, _util.promisify)(_fs.default.writeFile);

var createLinRC = function createLinRC() {
  _fs.default.writeFileSync(_base.config_path, "type=".concat(_base.default_config.type, "\nregistry=").concat(_base.default_config.registry));
};

var get = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(key) {
    var exit, opts;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fs.default.existsSync(_base.config_path);

          case 2:
            exit = _context.sent;

            if (!exit) {
              _context.next = 11;
              break;
            }

            _context.next = 6;
            return readFile(_base.config_path, 'utf8');

          case 6:
            opts = _context.sent;
            opts = (0, _ini.decode)(opts);
            return _context.abrupt("return", opts[key]);

          case 11:
            createLinRC();
            return _context.abrupt("return", _base.default_config);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function get(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.get = get;

var getAll = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var exit, opts;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _fs.default.existsSync(_base.config_path);

          case 2:
            exit = _context2.sent;

            if (!exit) {
              _context2.next = 11;
              break;
            }

            _context2.next = 6;
            return readFile(_base.config_path, 'utf8');

          case 6:
            opts = _context2.sent;
            opts = (0, _ini.decode)(opts);
            return _context2.abrupt("return", opts);

          case 11:
            createLinRC();
            return _context2.abrupt("return", _base.default_config);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getAll() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getAll = getAll;

var set = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(key, value) {
    var exit, opts;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _fs.default.existsSync(_base.config_path);

          case 2:
            exit = _context3.sent;

            if (!exit) {
              _context3.next = 17;
              break;
            }

            _context3.next = 6;
            return readFile(_base.config_path, 'utf8');

          case 6:
            opts = _context3.sent;
            opts = (0, _ini.decode)(opts);

            if (key) {
              _context3.next = 11;
              break;
            }

            console.log(_chalk.default.red(_chalk.default.bold('Error:')), _chalk.default.red('key 是必须的!'));
            return _context3.abrupt("return");

          case 11:
            if (value) {
              _context3.next = 14;
              break;
            }

            console.log(_chalk.default.red(_chalk.default.bold('Error:')), _chalk.default.red('value 是必须的!'));
            return _context3.abrupt("return");

          case 14:
            Object.assign(opts, (0, _defineProperty2.default)({}, key, value));
            _context3.next = 18;
            break;

          case 17:
            opts = Object.assign(_base.default_config, (0, _defineProperty2.default)({}, key, value));

          case 18:
            _context3.next = 20;
            return writeFile(_base.config_path, (0, _ini.encode)(opts), 'utf8');

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function set(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.set = set;

var remove = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(key) {
    var exit, opts;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _fs.default.existsSync(_base.config_path);

          case 2:
            exit = _context4.sent;

            if (!exit) {
              _context4.next = 11;
              break;
            }

            _context4.next = 6;
            return readFile(_base.config_path, 'utf8');

          case 6:
            opts = _context4.sent;
            opts = (0, _ini.decode)(opts);
            delete opts[key];
            _context4.next = 11;
            return writeFile(_base.config_path, (0, _ini.encode)(opts), 'utf8');

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function remove(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.remove = remove;