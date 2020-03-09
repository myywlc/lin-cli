"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = exports.cmd = exports.name = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fetchGitRepository = _interopRequireDefault(require("../utils/fetchGitRepository"));

var _ora = _interopRequireDefault(require("ora"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _logSymbols = _interopRequireDefault(require("log-symbols"));

var name = 'init';
exports.name = name;
var cmd = {
  description: '从模板生成新项目',
  usages: ['lin init templateName projectName']
};
exports.cmd = cmd;

var handle = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(templateName, projectName) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (templateName) {
              _context2.next = 3;
              break;
            }

            console.log(_chalk.default.red(_chalk.default.bold('Error:')), _chalk.default.red('template name 是必须的!'));
            return _context2.abrupt("return");

          case 3:
            if (projectName) {
              _context2.next = 6;
              break;
            }

            console.log(_chalk.default.red(_chalk.default.bold('Error:')), _chalk.default.red('project name 是必须的!'));
            return _context2.abrupt("return");

          case 6:
            if (!_fs.default.existsSync(projectName)) {
              _inquirer.default.prompt([{
                name: 'description',
                message: '请输入项目说明: '
              }, {
                name: 'author',
                message: '请输入作者名称: '
              }]).then( /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(answer) {
                  var loading;
                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          loading = (0, _ora.default)('下载模板中 ...');
                          loading.start();
                          (0, _fetchGitRepository.default)(templateName, projectName).then(function () {
                            loading.succeed();
                            var fileName = "".concat(projectName, "/package.json");

                            if (_fs.default.existsSync(fileName)) {
                              var data = _fs.default.readFileSync(fileName).toString();

                              var json = JSON.parse(data);
                              json.name = projectName;
                              json.author = answer.author;
                              json.description = answer.description;

                              _fs.default.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');

                              console.log(_logSymbols.default.success, _chalk.default.green('项目初始化完成!'));
                            }
                          }, function () {
                            loading.fail();
                          });

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
            } else {
              console.log(_logSymbols.default.error, _chalk.default.red('该项目已经存在!'));
            }

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handle(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.handle = handle;