'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _base = require('./utils/base');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * lin commands
 *    - config
 *    - init
 */

// 控制加载文件
let apply = (action, ...args) => {
  //babel-env
  require(`./${action}`)(...args);
};

let actionMap = {
  init: {
    description: '从模板生成新项目',
    usages: ['lin init templateName projectName']
  },
  config: {
    alias: 'cfg',
    description: 'config .linrc',
    usages: ['lin config set <k> <v>', 'lin config get <k>', 'lin config remove <k>']
  }
  //other commands
};

// 添加 init / config 命令
Object.keys(actionMap).forEach(action => {
  _commander2.default.command(action).description(actionMap[action].description).alias(actionMap[action].alias) //别名
  .action(() => {
    switch (action) {
      case 'config':
        //配置
        apply(action, ...process.argv.slice(3));
        break;
      case 'init':
        apply(action, ...process.argv.slice(3));
        break;
      default:
        break;
    }
  });
});

function help() {
  console.log('\r\nUsage:');
  Object.keys(actionMap).forEach(action => {
    actionMap[action].usages.forEach(usage => {
      console.log('  - ' + usage);
    });
  });
  console.log('\r');
}

_commander2.default.usage('<command> [options]');

// lin -h
_commander2.default.on('-h', help);
_commander2.default.on('--help', help);

// lin -v   VERSION 为 package.json 中的版本号
_commander2.default.version(_base.VERSION, '-v --version');

_commander2.default.parse(process.argv);

// lin 不带参数时
if (!process.argv.slice(2).length) {
  _commander2.default.outputHelp(make_green);
}

function make_green(txt) {
  return _chalk2.default.green(txt);
}