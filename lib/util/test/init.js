import { createAllTables, dropAllTables } from 'script/db';

export default async () => {
  await dropAllTables();
  await createAllTables();
};
