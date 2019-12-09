import { RC, DEFAULTS } from './constants';
import { decode, encode } from 'ini';
import { promisify } from 'util';
import chalk from 'chalk';
import fs from 'fs';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const createLinRC = () => {
  fs.writeFileSync(RC, `type=${DEFAULTS.type}
registry=${DEFAULTS.registry}`);
};

//RC 是配置文件
//DEFAULTS 是默认的配置
export const get = async key => {
  const exit = await fs.existsSync(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    return opts[key];
  } else {
    createLinRC();
    return DEFAULTS;
  }
};

export const getAll = async () => {
  const exit = await fs.existsSync(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    return opts;
  } else {
    createLinRC();
    return DEFAULTS;
  }
};

export const set = async (key, value) => {
  const exit = await fs.existsSync(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    if (!key) {
      console.log(chalk.red(chalk.bold('Error:')), chalk.red('key is required'));
      return;
    }
    if (!value) {
      console.log(chalk.red(chalk.bold('Error:')), chalk.red('value is required'));
      return;
    }
    Object.assign(opts, { [key]: value });
  } else {
    opts = Object.assign(DEFAULTS, { [key]: value });
  }
  await writeFile(RC, encode(opts), 'utf8');
};

export const remove = async key => {
  const exit = await fs.existsSync(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    delete opts[key];
    await writeFile(RC, encode(opts), 'utf8');
  }
};
