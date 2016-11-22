import * as models from 'lib/model';
import query, { end } from 'lib/query';

const creationOrder = [
  models.User,
];

export const createAllTables = async () => { // eslint-disable-line import/prefer-default-export
  for (let i = 0; i < creationOrder.length; i += 1) {
    await query(creationOrder[i].create().ifNotExists());
  }
};

export const dropAllTables = async () => { // eslint-disable-line import/prefer-default-export
  for (let i = creationOrder.length - 1; i >= 0; i -= 1) {
    await query(creationOrder[i].drop().ifExists());
  }
};

export { end };
