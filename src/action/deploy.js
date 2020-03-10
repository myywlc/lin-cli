import path from 'path';
import fs from 'fs';
import ora from 'ora';
import inquirer from 'inquirer';
import archiver from 'archiver';
import node_ssh from 'node-ssh';
import childProcess from 'child_process';
import { infoLog, errorLog, successLog, underlineLog, checkDeployConfig } from '../utils/utils_deploy';

const deployConfigPath = `${process.cwd()}/deploy.config.js`;

const ssh = new node_ssh(); // 生成ssh实例

export const name = 'deploy';

export const cmd = {
  description: 'deploy package',
  usages: ['lin deploy init', 'lin deploy'],
};

export const handle = async (key) => {
  switch (key) {
    case 'init':
      checkDeployExists();
      break;
    default:
      handleDeploy();
      break;
  }
};

// ===================== init =========================

// 检查部署目录及部署配置文件是否存在
const checkDeployExists = () => {
  if (fs.existsSync(deployConfigPath)) {
    infoLog('根目录下的deploy.config.js配置文件已经存在!');
    process.exit(1);
    return;
  }
  writeConfigFile();
};

const configTemplate = `const config = {
  privateKey: '', // 本地私钥地址，位置一般在C:/Users/xxx/.ssh/id_rsa，非必填，有私钥则配置
  passphrase: '', // 本地私钥密码，非必填，有私钥则配置
  projectName: '', // 项目名称
  // 根据需要进行配置，如只需部署prod线上环境，请删除dev测试环境配置，反之亦然，支持多环境部署
  dev: {
    // 测试环境
    name: '测试环境',
    script: 'npm run build', // 测试环境打包脚本
    host: '', // 测试服务器地址
    port: 22, // ssh port，一般默认22
    username: '', // 登录服务器用户名
    password: '', // 登录服务器密码
    distPath: 'dist', // 本地打包dist目录
    // distPath: {
    //   files: ['package.json', 'yarn.lock', '.gitignore', '.prettierrc.js', 'babel.config.js', 'README.md'],
    //   directory: ['dist', 'static']
    // },
    webDir: '', // 测试环境服务器地址
  },
  prod: {
    // 线上环境
    name: '线上环境',
    script: 'npm run build', // 线上环境打包脚本
    host: '', // 线上服务器地址
    port: 22, // ssh port，一般默认22
    username: '', // 登录服务器用户名
    password: '', // 登录服务器密码
    distPath: 'dist', // 本地打包dist目录
    // distPath: {
    //   files: ['package.json', 'yarn.lock', '.gitignore', '.prettierrc.js', 'babel.config.js', 'README.md'],
    //   directory: ['dist', 'static']
    // },
    webDir: '', // 线上环境web目录
  },
};

module.exports = { config };
`;

const writeConfigFile = () => {
  const spinner = ora('开始生成部署模板');
  spinner.start();
  fs.writeFile(deployConfigPath, configTemplate, { encoding: 'utf8' }, (err) => {
    if (err) {
      errorLog(err);
      process.exit(1);
    }
    spinner.stop();
    successLog('配置模板创建成功');
    infoLog('请配置根目录下的deploy.config.js配置文件');
    errorLog('注意：请在.gitignore配置忽略deploy.config.js文件,避免关键信息泄露');
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
    successLog(` ${underlineLog(projectName)}项目${underlineLog(name)}部署成功 \n`);
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
    childProcess.execSync(script, { cwd: process.cwd() });
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
    const output = fs.createWriteStream(`${process.cwd()}/dist.zip`);
    console.log('（2）打包成zip');
    const archive = archiver('zip', {
      zlib: { level: 9 },
    }).on('error', err => {
      throw err;
    });
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

    if (distPath instanceof Object) {
      const { files, directory } = distPath;
      files.forEach((item) => {
        archive.file(`${process.cwd()}/${item}`, { name: item });
      });
      directory.forEach((item) => {
        archive.directory(`${process.cwd()}/${item}`, `/${item}`);
      });
    } else {
      distPath = path.resolve(process.cwd(), distPath);
      archive.directory(distPath, '/');
    }
    archive.finalize();
  });
}

// 第三步，连接SSH
async function connectSSH(config) {
  const { host, port, username, password, privateKey, passphrase } = config;
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
    await ssh.putFile(`${process.cwd()}/dist.zip`, `${webDir}/dist.zip`);
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
    fs.unlink(`${process.cwd()}/dist.zip`, err => {
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

async function handleDeploy() {
  // 检测部署配置是否合理
  const deployConfigs = await checkDeployConfig(deployConfigPath);
  if (!deployConfigs) {
    process.exit(1);
  }

  const choices = deployConfigs.map(config => {
    const { name } = config;
    return name
  });

  inquirer
    .prompt([
      {
        type: 'list',
        message: `将${underlineLog(deployConfigs[0].projectName)}项目是否部署到什么环境 ？`,
        name: 'env',
        choices,
        filter: function (val) { // 使用filter将回答变为小写
          return val.toLowerCase();
        }
      }
    ])
    .then(answers => {
      const { env } = answers;
      if (!env) {
        process.exit(1);
      }
      const targetObj = deployConfigs.find(item => item.name === env);
      if (targetObj) {
        runDeploy(targetObj)
      }
    });
}
