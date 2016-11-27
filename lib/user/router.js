import { createRouter } from 'lib/api/router';
import { bearer } from 'lib/auth';
import { all, create, get, del, update } from './controller';

export default createRouter()
  .get('/', all)
  .post('/', create)
  .get('/:userId', get)
  .delete('/:userId', bearer, del)
  .put('/:userId', bearer, update);
