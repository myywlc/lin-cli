"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default_config = exports.config_path = exports.VERSION = void 0;

var _package = require("../../package.json");

var VERSION = _package.version;
exports.VERSION = VERSION;
var HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
var config_path = "".concat(HOME, "/.linrc");
exports.config_path = config_path;
var default_config = {
  registry: 'myywlc',
  type: 'users'
};
exports.default_config = default_config;