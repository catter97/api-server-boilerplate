import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from 'lib/user';
import { queryOne } from 'lib/query';

passport.use(new LocalStrategy((username, password, done) => {
  queryOne(User.select().where(User.username.equals(username)))
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

export default passport;
