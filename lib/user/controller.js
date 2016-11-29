import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import { query, queryOne } from 'lib/query';
import User from './model';

const omit = (user) => {
  if (user) {
    user.password = undefined; // eslint-disable-line no-param-reassign
  }
  return user;
};

const salt = bcrypt.genSaltSync(10);

export const all = async (req, res) => {
  const users = await query(User.select().order(User.id.asc));
  users.forEach(user => omit(user));
  res.data(users);
};

export const create = async (req, res) => {
  const { email, password, username } = req.body;
  const encrypted = bcrypt.hashSync(password, salt);
  const user = await queryOne(User.insert({
    username,
    email,
    password: encrypted,
  }).returning());
  res.data(omit(user));
};

export const del = async (req, res) => {
  const { userId } = req.params;
  const user = await queryOne(User.delete().where(User.id.equals(userId)).returning());
  res.data(omit(user));
};

export const get = async (req, res) => {
  const { userId } = req.params;
  const user = await queryOne(User.select().where(User.id.equals(userId)));
  res.data(omit(user));
};

export const update = async (req, res) => {
  const user = req.body;
  if (!user.username) {
    throw new createError.BadRequest('Username is required');
  }

  const { userId } = req.params;
  const ret = await queryOne(
    User.update(user).where(User.id.equals(userId)).returning());
  res.data(omit(ret));
};
