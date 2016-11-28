import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';

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
