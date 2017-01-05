import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import User from './model';

const omit = (user) => {
  if (user) {
    user.password = undefined; // eslint-disable-line no-param-reassign
  }
  return user;
};

const salt = bcrypt.genSaltSync(10);

export const all = async (req, res) => {
  const users = await User.all();
  users.forEach(user => omit(user));
  res.data(users);
};

export const create = async (req, res) => {
  const { email, password, username } = req.body;
  const encrypted = bcrypt.hashSync(password, salt);
  const user = await User.add({ username, email, password: encrypted });
  res.data(omit(user));
};

export const del = async (req, res) => {
  const { userId } = req.params;
  const user = await User.deleteById(userId);
  res.data(omit(user));
};

export const get = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  res.data(omit(user));
};

export const update = async (req, res) => {
  const user = req.body;
  if (!user.username) {
    throw new createError.BadRequest('Username is required');
  }

  const { userId } = req.params;
  const ret = await User.updateById(userId, user);
  res.data(omit(ret));
};
