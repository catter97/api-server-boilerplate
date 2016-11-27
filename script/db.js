import { User } from 'lib/user';
import { end, query } from 'lib/query';

const models = [
  User,
];

export const createAllTables = async () => { // eslint-disable-line import/prefer-default-export
  for (let i = 0; i < models.length; i += 1) {
    await query(models[i].create().ifNotExists());
  }
};

export const dropAllTables = async () => { // eslint-disable-line import/prefer-default-export
  for (let i = models.length - 1; i >= 0; i -= 1) {
    await query(models[i].drop().ifExists());
  }
};

export { end };
