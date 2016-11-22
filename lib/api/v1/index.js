import { createRouter } from 'lib/api/router';
import users from './users';

export default createRouter()
  .use('/users', users);
