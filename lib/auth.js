import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';

import { createRouter } from 'lib/api/router';
import config from 'lib/config';
import { User } from 'lib/user';
import { queryOne } from 'lib/query';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => queryOne(User.select().where(User.id.equals(id)))
  .then(user => done(null, user))
  .catch(done));

passport.use(new LocalStrategy((username, password, done) => {
  queryOne(User.select().where(User.username.equals(username)).or(User.email.equals(username)))
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(done);
}));

passport.use(new BearerStrategy((token, done) =>
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return done(err);
    }
    if (!decoded.id) {
      return done(null, false);
    }
    return queryOne(User.select().where(User.id.equals(decoded.id)))
      .then(user => done(null, user.password === decoded.password && user))
      .catch(done);
  }),
));

export { passport };

const loginMiddleware = (req, res) => {
  if (!req.user) {
    const code = 401;
    return res.status(code).json({ status: { code } });
  }
  const { id, password } = req.user;
  const user = { ...req.user };
  user.password = undefined;
  user.token = jwt.sign({ id, password }, config.jwt.secret);
  return res.json(user);
};

export const login = createRouter()
  .get('/login', passport.session(), loginMiddleware)
  .post('/login', passport.authenticate('local'), loginMiddleware);

export const bearer = passport.authenticate('bearer', { session: false });
