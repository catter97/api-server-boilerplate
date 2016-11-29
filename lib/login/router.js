import jwt from 'jsonwebtoken';
import passport from 'passport';

import config from 'lib/config';
import { createRouter } from 'lib/router';

const loginMiddleware = (req, res) => {
  if (!req.user) {
    const code = 401;
    return res.status(code).json({ status: { code } });
  }
  const { id, password } = req.user;
  const user = { ...req.user };
  user.password = undefined;
  user.token = jwt.sign({ id, password }, config.jwt.secret);
  return res.data(user);
};

export default createRouter()
  .get('/', passport.session(), loginMiddleware)
  .post('/', passport.authenticate('local'), loginMiddleware);
