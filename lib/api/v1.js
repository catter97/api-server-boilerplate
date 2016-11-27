import { createRouter } from 'lib/api/router';
import { router as userRouter } from 'lib/user';

export default createRouter()
  .use('/users', userRouter);
