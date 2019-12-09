import { version } from '../../package.json';

export const VERSION = version;

const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

export const config_path = `${HOME}/.linrc`;

export const default_config = {
  registry: 'myywlc',
  type: 'users',
};
