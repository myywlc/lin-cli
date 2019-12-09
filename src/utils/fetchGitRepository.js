import { getAll } from './handleRC';
import downloadGitRepo from 'download-git-repo';

export default async (templateName, projectName) => {
  let config = await getAll();
  let api = `${config.registry}/${templateName}`;
  return new Promise((resolve, reject) => {
    downloadGitRepo(api, projectName, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
