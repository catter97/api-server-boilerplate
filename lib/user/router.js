import createError from 'http-errors';

import { createRouter } from 'lib/api/router';
import { admin, me } from 'lib/role';
import { all, create, get, del, update } from './controller';

export default createRouter()
  .param('userId', (req, res, next, id) => {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new createError.BadRequest('Invalid user ID');
    }
    req.params.userId = userId; // eslint-disable-line no-param-reassign
    next();
  })
  .get('/', admin, all)
  .post('/', create)
  .get('/:userId', me, get)
  .delete('/:userId', me, del)
  .put('/:userId', me, update);
