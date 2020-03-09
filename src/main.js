import program from 'commander';
import { VERSION } from './utils/base';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';

async function loadActionFiles() {
  let files = glob.sync('dist/action/*.js');
  let promiseArr = [];
  files.forEach(item => {
    const filePath = path.resolve(`${__dirname}/../`, item);
    console.log(filePath, 'filePath');
    promiseArr.push(import(filePath));
  });
  return await Promise.all(promiseArr);
}

loadActionFiles().then(actionMap => {

  actionMap.forEach(configObj => {
    program
      .command(configObj.name)
      .description(configObj.cmd.description)
      .alias(configObj.cmd.alias) //别名
      .action(() => {
        configObj.handle(configObj.name, ...process.argv.slice(3));
      });
  });

  function help() {
    console.log('\r\nUsage:');
    actionMap.forEach(configObj => {
      configObj.cmd.usages.forEach(usage => {
        console.log('  - ' + usage);
      });
    });
    console.log('\r');
  }

  // lin -h
  program.on('-h', help);
  program.on('--help', help);

  program.usage('<command> [options]');

  // lin -v
  program.version(VERSION, '-v --version');

  program.parse(process.argv);

  // lin 不带参数时
  if (!process.argv.slice(2).length) {
    program.outputHelp(make_green);
  }

  function make_green(txt) {
    return chalk.green(txt);
  }
});
