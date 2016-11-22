import { define, id, text } from 'lib/model/sql';

export default define('users', [
  id(),
  text('name'),
]);
