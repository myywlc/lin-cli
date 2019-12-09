'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default_config = exports.config_path = exports.VERSION = undefined;

var _package = require('../../package.json');

const VERSION = exports.VERSION = _package.version;

const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

const config_path = exports.config_path = `${HOME}/.linrc`;

const default_config = exports.default_config = {
  registry: 'myywlc',
  type: 'users'
};