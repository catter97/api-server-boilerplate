import Pool from 'pg-pool';

import config from 'lib/config';

const pool = new Pool(config.pg);
const q = sql => pool.connect()
  .then(client => client.query(sql.toQuery())
    .then((res) => {
      client.release();
      return res.rows;
    })
    .catch((e) => {
      client.release();
      throw e;
    }));

export const query = sql => q(sql);
export const queryOne = sql => q(sql).then(rows => rows[0]);
export const end = () => pool.end();
