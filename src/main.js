import program from 'commander';
import { VERSION } from './utils/constants';
import chalk from 'chalk';

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
    description: 'generate a new project from a template',
    usages: ['lin init templateName projectName'],
  },
  config: {
    alias: 'cfg',
    description: 'config .linrc',
    usages: ['lin config set <k> <v>', 'lin config get <k>', 'lin config remove <k>'],
  },
  //other commands
};

// 添加 init / config 命令
Object.keys(actionMap).forEach(action => {
  program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias) //别名
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

program.usage('<command> [options]');

// lin -h
program.on('-h', help);
program.on('--help', help);
// lin -V   VERSION 为 package.json 中的版本号
program.version(VERSION, '-v --version');

program.parse(process.argv);

// lin 不带参数时
if (!process.argv.slice(2).length) {
  program.outputHelp(make_green);
}

function make_green(txt) {
  return chalk.green(txt);
}


