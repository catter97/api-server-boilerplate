import { createRouter } from 'lib/router';
import { router as loginRouter } from 'lib/login';
import { router as userRouter } from 'lib/user';

export default createRouter()
  .use('/login', loginRouter)
  .use('/users', userRouter);
