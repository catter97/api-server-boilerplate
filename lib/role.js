import createError from 'http-errors';
import passport from 'passport';

const bearer = passport.authenticate('bearer', { session: false });
const isAdmin = user => user.role && user.role.admin;
const role = fn => [bearer, (req, res, next) => {
  if (!isAdmin(req.user) && !fn(req)) {
    throw new createError.Unauthorized();
  }
  next();
}];

export const admin = role(() => false);
export const authorized = bearer;
export const me = role(req => req.user.id === req.params.userId);
