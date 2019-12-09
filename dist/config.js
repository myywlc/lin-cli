'use strict';

var _handleRC = require('./utils/handleRC');

let config = async (action, key, value) => {
  switch (action) {
    case 'get':
      if (key) {
        let result = await (0, _handleRC.get)(key);
        console.log(result);
      } else {
        let obj = await (0, _handleRC.getAll)();
        Object.keys(obj).forEach(key => {
          console.log(`${key}=${obj[key]}`);
        });
      }
      break;
    case 'set':
      (0, _handleRC.set)(key, value);
      break;
    case 'remove':
      (0, _handleRC.remove)(key);
      break;
    default:
      break;
  }
};

module.exports = config;