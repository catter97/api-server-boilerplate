import bcrypt from 'bcryptjs';
import createError from 'http-errors';
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
        return done(new createError.Unauthorized('Invalid username'));
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(new createError.Unauthorized('Invalid password'));
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
      return done(new createError.Unauthorized('Invalid token'));
    }
    return queryOne(User.select().where(User.id.equals(decoded.id)))
      .then((user) => {
        if (user.password !== decoded.password) {
          return done(new createError.Unauthorized('Invalid token'));
        }
        return done(null, user);
      })
      .catch(done);
  }),
));
