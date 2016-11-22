import { createRouter } from 'lib/api/router';
import { user } from 'lib/controller';

export default createRouter()
  .get('/', user.all);
