import { get, set, getAll, remove } from '../utils/handleRC';

export const name = 'config';

export const cmd = {
  description: 'config .linrc',
  usages: ['lin config set <k> <v>', 'lin config get <k>', 'lin config remove <k>'],
};

export const handle = async (action, key, value) => {
  switch (action) {
    case 'get':
      if (key) {
        let result = await get(key);
        console.log(result);
      } else {
        let obj = await getAll();
        Object.keys(obj).forEach(key => {
          console.log(`${key}=${obj[key]}`);
        });
      }
      break;
    case 'set':
      set(key, value);
      break;
    case 'remove':
      remove(key);
      break;
    default:
      break;
  }
};
