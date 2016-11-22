import { User } from 'lib/model';
import query from 'lib/query';

export const all = async (req, res) => {
  res.data(await query(User.select()));
};

export default {
  all,
};
