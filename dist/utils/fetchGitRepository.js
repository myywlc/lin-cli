'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handleRC = require('./handleRC');

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async (templateName, projectName) => {
  let config = await (0, _handleRC.getAll)();
  let api = `${config.registry}/${templateName}`;
  return new Promise((resolve, reject) => {
    (0, _downloadGitRepo2.default)(api, projectName, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};