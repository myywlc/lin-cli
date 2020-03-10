"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.bold");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startLog = startLog;
exports.infoLog = infoLog;
exports.successLog = successLog;
exports.errorLog = errorLog;
exports.underlineLog = underlineLog;
exports.checkDeployConfig = checkDeployConfig;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var DEPLOY_SCHEMA = {
  name: '',
  script: '',
  host: '',
  port: 22,
  username: '',
  password: '',
  webDir: ''
};
var PRIVATE_KEY_DEPLOY_SCHEMA = {
  name: '',
  script: '',
  host: '',
  port: 22,
  webDir: ''
}; // 开始部署日志

function startLog() {
  console.log(_chalk.default.magenta.apply(_chalk.default, arguments));
} // 信息日志


function infoLog() {
  console.log(_chalk.default.blue.apply(_chalk.default, arguments));
} // 成功日志


function successLog() {
  console.log(_chalk.default.green.apply(_chalk.default, arguments));
} // 错误日志


function errorLog() {
  console.log(_chalk.default.red.apply(_chalk.default, arguments));
} // 下划线重点输出


function underlineLog(content) {
  return _chalk.default.blue.underline.bold("".concat(content));
} // 检查配置是否符合特定schema


function checkConfigScheme(configKey, configObj, privateKey) {
  var deploySchemaKeys = null;
  var configKeys = Object.keys(configObj);
  var neededKeys = [];
  var unConfigKeys = [];
  var configValid = true;

  if (privateKey) {
    deploySchemaKeys = Object.keys(PRIVATE_KEY_DEPLOY_SCHEMA);
  } else {
    deploySchemaKeys = Object.keys(DEPLOY_SCHEMA);
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = deploySchemaKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (!configKeys.includes(key)) {
        neededKeys.push(key);
      }

      if (configObj[key] === '') {
        unConfigKeys.push(key);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (neededKeys.length > 0) {
    errorLog("".concat(configKey, "\u7F3A\u5C11").concat(neededKeys.join(','), "\u914D\u7F6E\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E"));
    configValid = false;
  }

  if (unConfigKeys.length > 0) {
    errorLog("".concat(configKey, "\u4E2D\u7684").concat(unConfigKeys.join(', '), "\u6682\u672A\u914D\u7F6E\uFF0C\u8BF7\u8BBE\u7F6E\u8BE5\u914D\u7F6E\u9879"));
    configValid = false;
  }

  return configValid;
} // 检查deploy配置是否合理


function checkDeployConfig(_x) {
  return _checkDeployConfig.apply(this, arguments);
}

function _checkDeployConfig() {
  _checkDeployConfig = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(deployConfigPath) {
    var _ref, config, privateKey, passphrase, projectName, keys, configs, _i, _keys, key;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!_fs.default.existsSync(deployConfigPath)) {
              _context.next = 23;
              break;
            }

            _context.next = 3;
            return Promise.resolve().then(function () {
              return (0, _interopRequireWildcard2.default)(require("".concat(deployConfigPath)));
            });

          case 3:
            _ref = _context.sent;
            config = _ref.config;
            privateKey = config.privateKey, passphrase = config.passphrase, projectName = config.projectName;
            keys = Object.keys(config);
            configs = [];
            _i = 0, _keys = keys;

          case 9:
            if (!(_i < _keys.length)) {
              _context.next = 22;
              break;
            }

            key = _keys[_i];

            if (!(config[key] instanceof Object)) {
              _context.next = 19;
              break;
            }

            if (checkConfigScheme(key, config[key], privateKey)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", false);

          case 14:
            config[key].command = key;
            config[key].privateKey = privateKey;
            config[key].passphrase = passphrase;
            config[key].projectName = projectName;
            configs.push(config[key]);

          case 19:
            _i++;
            _context.next = 9;
            break;

          case 22:
            return _context.abrupt("return", configs);

          case 23:
            infoLog("\u7F3A\u5C11\u90E8\u7F72\u76F8\u5173\u7684\u914D\u7F6E\uFF0C\u8BF7\u8FD0\u884C".concat(underlineLog('lin deploy init'), "\u521B\u5EFA\u90E8\u7F72\u914D\u7F6E\u6587\u4EF6"));
            return _context.abrupt("return", false);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _checkDeployConfig.apply(this, arguments);
}