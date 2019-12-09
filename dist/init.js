'use strict';

var _fetchGitRepository = require('./utils/fetchGitRepository');

var _fetchGitRepository2 = _interopRequireDefault(_fetchGitRepository);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logSymbols = require('log-symbols');

var _logSymbols2 = _interopRequireDefault(_logSymbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let init = async (templateName, projectName) => {
  if (!templateName) {
    console.log(_chalk2.default.red(_chalk2.default.bold('Error:')), _chalk2.default.red('template name 是必须的!'));
    return;
  }
  if (!projectName) {
    console.log(_chalk2.default.red(_chalk2.default.bold('Error:')), _chalk2.default.red('project name 是必须的!'));
    return;
  }
  if (!_fs2.default.existsSync(projectName)) {
    _inquirer2.default.prompt([{
      name: 'description',
      message: '请输入项目说明: '
    }, {
      name: 'author',
      message: '请输入作者名称: '
    }]).then(async answer => {
      let loading = (0, _ora2.default)('下载模板中 ...');
      loading.start();
      (0, _fetchGitRepository2.default)(templateName, projectName).then(() => {
        loading.succeed();
        const fileName = `${projectName}/package.json`;
        if (_fs2.default.existsSync(fileName)) {
          const data = _fs2.default.readFileSync(fileName).toString();
          let json = JSON.parse(data);
          json.name = projectName;
          json.author = answer.author;
          json.description = answer.description;
          _fs2.default.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
          console.log(_logSymbols2.default.success, _chalk2.default.green('项目初始化完成!'));
        }
      }, () => {
        loading.fail();
      });
    });
  } else {
    console.log(_logSymbols2.default.error, _chalk2.default.red('该项目已经存在!'));
  }
};

module.exports = init;