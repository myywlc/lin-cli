import fs from 'fs';
import chalk from 'chalk';

const DEPLOY_SCHEMA = {
  name: '',
  script: '',
  host: '',
  port: 22,
  username: '',
  password: '',
  webDir: '',
};

const PRIVATE_KEY_DEPLOY_SCHEMA = {
  name: '',
  script: '',
  host: '',
  port: 22,
  webDir: '',
};

// 开始部署日志
export function startLog(...content) {
  console.log(chalk.magenta(...content));
}

// 信息日志
export function infoLog(...content) {
  console.log(chalk.blue(...content));
}

// 成功日志
export function successLog(...content) {
  console.log(chalk.green(...content));
}

// 错误日志
export function errorLog(...content) {
  console.log(chalk.red(...content));
}

// 下划线重点输出
export function underlineLog(content) {
  return chalk.blue.underline.bold(`${content}`);
}

// 检查配置是否符合特定schema
function checkConfigScheme(configKey, configObj, privateKey) {
  let deploySchemaKeys = null;
  const configKeys = Object.keys(configObj);
  const neededKeys = [];
  const unConfigKeys = [];
  let configValid = true;
  if (privateKey) {
    deploySchemaKeys = Object.keys(PRIVATE_KEY_DEPLOY_SCHEMA);
  } else {
    deploySchemaKeys = Object.keys(DEPLOY_SCHEMA);
  }
  for (let key of deploySchemaKeys) {
    if (!configKeys.includes(key)) {
      neededKeys.push(key);
    }
    if (configObj[key] === '') {
      unConfigKeys.push(key);
    }
  }
  if (neededKeys.length > 0) {
    errorLog(`${configKey}缺少${neededKeys.join(',')}配置，请检查配置`);
    configValid = false;
  }
  if (unConfigKeys.length > 0) {
    errorLog(`${configKey}中的${unConfigKeys.join(', ')}暂未配置，请设置该配置项`);
    configValid = false;
  }
  return configValid;
}

// 检查deploy配置是否合理
export async function checkDeployConfig(deployConfigPath) {
  if (fs.existsSync(deployConfigPath)) {
    const { config } = await import(deployConfigPath);
    const { privateKey, passphrase, projectName } = config;
    const keys = Object.keys(config);
    const configs = [];
    for (let key of keys) {
      if (config[key] instanceof Object) {
        if (!checkConfigScheme(key, config[key], privateKey)) {
          return false;
        }
        config[key].command = key;
        config[key].privateKey = privateKey;
        config[key].passphrase = passphrase;
        config[key].projectName = projectName;
        configs.push(config[key]);
      }
    }
    return configs;
  }
  infoLog(`缺少部署相关的配置，请运行${underlineLog('lin deploy init')}创建部署配置文件`);
  return false;
}
