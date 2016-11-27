import { define, id, text } from 'lib/sql';

export default define('users', [
  id(),
  text('username', { unique: true }),
  text('password'),
]);
