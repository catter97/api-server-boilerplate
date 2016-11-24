import { createRouter } from 'lib/api/router';
import { all, create, get, del, update } from 'lib/controller/user';

export default createRouter()
  .get('/', all)
  .post('/', create)
  .get('/:userId', get)
  .delete('/:userId', del)
  .put('/:userId', update);
