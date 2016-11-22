/* eslint-disable no-console */

import '../module_path';
import { createAllTables, dropAllTables, end } from './db'; // eslint-disable-line import/first

const init = async () => {
  console.log('Dropping all tables...');
  await dropAllTables();
  console.log('Creating all tables...');
  await createAllTables();
  await end();
};

init()
  .then(() => console.log('Done.'))
  .catch(console.error);
