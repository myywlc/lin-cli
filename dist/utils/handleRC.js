'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.set = exports.getAll = exports.get = undefined;

var _base = require('./base');

var _ini = require('ini');

var _util = require('util');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = (0, _util.promisify)(_fs2.default.readFile);
const writeFile = (0, _util.promisify)(_fs2.default.writeFile);

const createLinRC = () => {
  _fs2.default.writeFileSync(_base.config_path, `type=${_base.default_config.type}
registry=${_base.default_config.registry}`);
};

const get = exports.get = async key => {
  const exit = await _fs2.default.existsSync(_base.config_path);
  let opts;
  if (exit) {
    opts = await readFile(_base.config_path, 'utf8');
    opts = (0, _ini.decode)(opts);
    return opts[key];
  } else {
    createLinRC();
    return _base.default_config;
  }
};

const getAll = exports.getAll = async () => {
  const exit = await _fs2.default.existsSync(_base.config_path);
  let opts;
  if (exit) {
    opts = await readFile(_base.config_path, 'utf8');
    opts = (0, _ini.decode)(opts);
    return opts;
  } else {
    createLinRC();
    return _base.default_config;
  }
};

const set = exports.set = async (key, value) => {
  const exit = await _fs2.default.existsSync(_base.config_path);
  let opts;
  if (exit) {
    opts = await readFile(_base.config_path, 'utf8');
    opts = (0, _ini.decode)(opts);
    if (!key) {
      console.log(_chalk2.default.red(_chalk2.default.bold('Error:')), _chalk2.default.red('key 是必须的!'));
      return;
    }
    if (!value) {
      console.log(_chalk2.default.red(_chalk2.default.bold('Error:')), _chalk2.default.red('value 是必须的!'));
      return;
    }
    Object.assign(opts, { [key]: value });
  } else {
    opts = Object.assign(_base.default_config, { [key]: value });
  }
  await writeFile(_base.config_path, (0, _ini.encode)(opts), 'utf8');
};

const remove = exports.remove = async key => {
  const exit = await _fs2.default.existsSync(_base.config_path);
  let opts;
  if (exit) {
    opts = await readFile(_base.config_path, 'utf8');
    opts = (0, _ini.decode)(opts);
    delete opts[key];
    await writeFile(_base.config_path, (0, _ini.encode)(opts), 'utf8');
  }
};