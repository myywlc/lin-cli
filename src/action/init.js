import fetchGitRepository from '../utils/fetchGitRepository';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import chalk from 'chalk';
import symbol from 'log-symbols';

export const name = 'init';

export const cmd = {
  description: '从模板生成新项目',
  usages: ['lin init templateName projectName'],
};

export const handle = async (templateName, projectName) => {
  if (!templateName) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red('template name 是必须的!'));
    return;
  }
  if (!projectName) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red('project name 是必须的!'));
    return;
  }
  if (!fs.existsSync(projectName)) {
    inquirer
      .prompt([
        {
          name: 'description',
          message: '请输入项目说明: ',
        },
        {
          name: 'author',
          message: '请输入作者名称: ',
        },
      ])
      .then(async answer => {
        let loading = ora('下载模板中 ...');
        loading.start();
        fetchGitRepository(templateName, projectName).then(
          () => {
            loading.succeed();
            const fileName = `${projectName}/package.json`;
            if (fs.existsSync(fileName)) {
              const data = fs.readFileSync(fileName).toString();
              let json = JSON.parse(data);

              json.name = projectName;
              json.author = answer.author;
              json.description = answer.description;

              fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
              console.log(symbol.success, chalk.green('项目初始化完成!'));
            }
          },
          () => {
            loading.fail();
          },
        );
      });
  } else {
    console.log(symbol.error, chalk.red('该项目已经存在!'));
  }
};
