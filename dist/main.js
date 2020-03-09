"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

require("regenerator-runtime/runtime");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _commander = _interopRequireDefault(require("commander"));

var _base = require("./utils/base");

var _chalk = _interopRequireDefault(require("chalk"));

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

function loadActionFiles() {
  return _loadActionFiles.apply(this, arguments);
}

function _loadActionFiles() {
  _loadActionFiles = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var files, promiseArr;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            files = _glob.default.sync('dist/action/*.js');
            promiseArr = [];
            files.forEach(function (item) {
              var filePath = _path.default.resolve("".concat(__dirname, "/../"), item);

              promiseArr.push(Promise.resolve().then(function () {
                return (0, _interopRequireWildcard2.default)(require("".concat(filePath)));
              }));
            });
            _context.next = 5;
            return Promise.all(promiseArr);

          case 5:
            return _context.abrupt("return", _context.sent);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadActionFiles.apply(this, arguments);
}

loadActionFiles().then(function (actionMap) {
  actionMap.forEach(function (configObj) {
    _commander.default.command(configObj.name).description(configObj.cmd.description).alias(configObj.cmd.alias) //别名
    .action(function () {
      configObj.handle.apply(configObj, (0, _toConsumableArray2.default)(process.argv.slice(3)));
    });
  });

  function help() {
    console.log('\r\nUsage:');
    actionMap.forEach(function (configObj) {
      configObj.cmd.usages.forEach(function (usage) {
        console.log('  - ' + usage);
      });
    });
    console.log('\r');
  } // lin -h


  _commander.default.on('-h', help);

  _commander.default.on('--help', help);

  _commander.default.usage('<command> [options]'); // lin -v


  _commander.default.version(_base.VERSION, '-v --version');

  _commander.default.parse(process.argv); // lin 不带参数时


  if (!process.argv.slice(2).length) {
    _commander.default.outputHelp(make_green);
  }

  function make_green(txt) {
    return _chalk.default.green(txt);
  }
});