import Pool from 'pg-pool';

import config from 'lib/config';

const pool = new Pool(config.pg);

export const end = () => pool.end();

export default (sql) => {
  const query = sql.toQuery();
  pool.connect().then(client => client.query(query)
    .then((res) => {
      client.release();
      return res;
    })
    .catch((e) => {
      client.release();
      throw e;
    }));
};
