import { createRouter } from 'lib/router';
import loginRouter from 'lib/login/router';
import userRouter from 'lib/user/router';

export default createRouter()
  .use('/login', loginRouter)
  .use('/users', userRouter);
