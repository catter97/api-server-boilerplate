import bcrypt from 'bcryptjs';

import { User } from 'lib/model';
import { query, queryOne } from 'lib/query';

const salt = bcrypt.genSaltSync(10);

export const all = async (req, res) => {
  res.data(await query(User.select()));
};

export const create = async (req, res) => {
  const { username, password } = req.body;
  const encrypted = bcrypt.hashSync(password, salt);
  const user = await queryOne(User.insert({
    username,
    password: encrypted,
  }).returning());
  user.password = undefined;
  res.data(user);
};

export default {
  all,
  create,
};
