import path from 'path';
import fs from 'fs';
import ora from 'ora';
import inquirer from 'inquirer';
import archiver from 'archiver';
import node_ssh from 'node-ssh';
import download from 'download-git-repo';
import childProcess from 'child_process';
import program from 'commander';
import { infoLog, errorLog, successLog, underlineLog, checkDeployConfig } from '../utils/utils_deploy';

const deployPath = path.join(process.cwd(), './deploy');
const deployConfigPath = `${deployPath}/deploy.config.js`;
const projectDir = process.cwd();
const deployGit = 'dadaiwei/fe-deploy-cli-template';
const tmp = 'deploy';

const ssh = new node_ssh(); // 生成ssh实例

export const name = 'deploy';

export const cmd = {
  description: 'deploy package',
  usages: ['lin deploy init', 'lin deploy this'],
};

export const handle = async (key, value) => {
  switch (key) {
    case 'init':
      checkDeployExists();
      break;
    case 'this':
      handleDeploy();
      break;
    default:
      break;
  }
};

// ===================== init =========================

// 检查部署目录及部署配置文件是否存在
const checkDeployExists = () => {
  if (fs.existsSync(deployPath) && fs.existsSync(deployConfigPath)) {
    infoLog('deploy目录下的deploy.config.js配置文件已经存在，请勿重新下载');
    process.exit(1);
    return;
  }
  downloadAndGenerate(deployGit);
};

// 下载部署脚本配置
const downloadAndGenerate = templateUrl => {
  const spinner = ora('开始生成部署模板');
  spinner.start();
  download(templateUrl, tmp, { clone: false }, err => {
    if (err) {
      console.log();
      errorLog(err);
      process.exit(1);
    }
    spinner.stop();
    successLog('模板下载成功，模板位置：deploy/deploy.config.js');
    infoLog('请配置deploy目录下的deploy.config.js配置文件');
    console.log('注意：请删除不必要的环境配置（如只需线上环境，请删除dev测试环境配置）');
    process.exit(0);
  });
};

// ===================== deploy =========================

// 部署流程入口
async function runDeploy(config) {
  const { script, webDir, distPath, projectName, name } = config;
  try {
    execBuild(script);
    await startZip(distPath);
    await connectSSH(config);
    await uploadFile(webDir);
    await unzipFile(webDir);
    await deleteLocalZip();
    successLog(`\n 恭喜您，${underlineLog(projectName)}项目${underlineLog(name)}部署成功了^_^\n`);
    process.exit(0);
  } catch (err) {
    errorLog(`  部署失败 ${err}`);
    process.exit(1);
  }
}

// 第一步，执行打包脚本
function execBuild(script) {
  try {
    console.log(`\n（1）${script}`);
    const spinner = ora('正在打包中');
    spinner.start();
    console.log();
    childProcess.execSync(script, { cwd: projectDir });
    spinner.stop();
    successLog('  打包成功');
  } catch (err) {
    errorLog(err);
    process.exit(1);
  }
}

// 第二部，打包zip
function startZip(distPath) {
  return new Promise((resolve, reject) => {
    distPath = path.resolve(projectDir, distPath);
    console.log('（2）打包成zip');
    const archive = archiver('zip', {
      zlib: { level: 9 },
    }).on('error', err => {
      throw err;
    });
    const output = fs.createWriteStream(`${projectDir}/dist.zip`);
    output.on('close', err => {
      if (err) {
        errorLog(`  关闭archiver异常 ${err}`);
        reject(err);
        process.exit(1);
      }
      successLog('  zip打包成功');
      resolve();
    });
    archive.pipe(output);
    archive.directory(distPath, '/');
    archive.finalize();
  });
}

// 第三步，连接SSH
async function connectSSH(config) {
  const { host, port, username, password, privateKey, passphrase, distPath } = config;
  const sshConfig = {
    host,
    port,
    username,
    password,
    privateKey,
    passphrase,
  };
  try {
    console.log(`（3）连接${underlineLog(host)}`);
    await ssh.connect(sshConfig);
    successLog('  SSH连接成功');
  } catch (err) {
    errorLog(`  连接失败 ${err}`);
    process.exit(1);
  }
}

// 第四部，上传zip包
async function uploadFile(webDir) {
  try {
    console.log(`（4）上传zip至目录${underlineLog(webDir)}`);
    await ssh.putFile(`${projectDir}/dist.zip`, `${webDir}/dist.zip`);
    successLog('  zip包上传成功');
  } catch (err) {
    errorLog(`  zip包上传失败 ${err}`);
    process.exit(1);
  }
}

// 运行命令
async function runCommand(command, webDir) {
  await ssh.execCommand(command, { cwd: webDir });
}

// 第五步，解压zip包
async function unzipFile(webDir) {
  try {
    console.log('（5）开始解压zip包');
    await runCommand(`cd ${webDir}`, webDir);
    await runCommand('unzip -o dist.zip && rm -f dist.zip', webDir);
    successLog('  zip包解压成功');
  } catch (err) {
    errorLog(`  zip包解压失败 ${err}`);
    process.exit(1);
  }
}

// 第六步，删除本地dist.zip包
async function deleteLocalZip() {
  return new Promise((resolve, reject) => {
    console.log('（6）开始删除本地zip包');
    fs.unlink(`${projectDir}/dist.zip`, err => {
      if (err) {
        errorLog(`  本地zip包删除失败 ${err}`, err);
        reject(err);
        process.exit(1);
      }
      successLog('  本地zip包删除成功\n');
      resolve();
    });
  });
}

function handleDeploy() {
  // 检测部署配置是否合理
  const deployConfigs = checkDeployConfig(deployConfigPath);
  if (!deployConfigs) {
    process.exit(1);
  }

  // 注册部署命令
  deployConfigs.forEach(config => {
    const { command, projectName, name } = config;
    program
      .command(`${command}`)
      .description(`${underlineLog(projectName)}项目${underlineLog(name)}部署`)
      .action(() => {
        inquirer
          .prompt([
            {
              type: 'confirm',
              message: `${underlineLog(projectName)}项目是否部署到${underlineLog(name)}？`,
              name: 'sure',
            },
          ])
          .then(answers => {
            const { sure } = answers;
            if (!sure) {
              process.exit(1);
            }
            if (sure) {
              runDeploy(config);
            }
          });
      });
  });
}
