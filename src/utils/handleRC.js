import { config_path, default_config } from './base';
import { decode, encode } from 'ini';
import { promisify } from 'util';
import chalk from 'chalk';
import fs from 'fs';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const createLinRC = () => {
  fs.writeFileSync(config_path, `type=${default_config.type}
registry=${default_config.registry}`);
};

//default_config 是默认的配置
export const get = async key => {
  const exit = await fs.existsSync(config_path);
  let opts;
  if (exit) {
    opts = await readFile(config_path, 'utf8');
    opts = decode(opts);
    return opts[key];
  } else {
    createLinRC();
    return default_config;
  }
};

export const getAll = async () => {
  const exit = await fs.existsSync(config_path);
  let opts;
  if (exit) {
    opts = await readFile(config_path, 'utf8');
    opts = decode(opts);
    return opts;
  } else {
    createLinRC();
    return default_config;
  }
};

export const set = async (key, value) => {
  const exit = await fs.existsSync(config_path);
  let opts;
  if (exit) {
    opts = await readFile(config_path, 'utf8');
    opts = decode(opts);
    if (!key) {
      console.log(chalk.red(chalk.bold('Error:')), chalk.red('key 是必须的!'));
      return;
    }
    if (!value) {
      console.log(chalk.red(chalk.bold('Error:')), chalk.red('value 是必须的!'));
      return;
    }
    Object.assign(opts, { [key]: value });
  } else {
    opts = Object.assign(default_config, { [key]: value });
  }
  await writeFile(config_path, encode(opts), 'utf8');
};

export const remove = async key => {
  const exit = await fs.existsSync(config_path);
  let opts;
  if (exit) {
    opts = await readFile(config_path, 'utf8');
    opts = decode(opts);
    delete opts[key];
    await writeFile(config_path, encode(opts), 'utf8');
  }
};
