import { define, id, json, text } from 'lib/sql';

export default define('users', [
  id(),
  text('username', { unique: true }),
  text('email', { unique: true }),
  text('password'),
  json('role'),
]);
