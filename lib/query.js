import Pool from 'pg-pool';
import pgTransact from 'pg-transact';

import config from 'lib/config';

const pool = new Pool(config.pg);

const convertSql = (sql) => {
  let params = sql;
  if (typeof params !== 'string') {
    if (params.toQuery) {
      params = params.toQuery();
    }
    if (params.values) {
      // Converts array parameters to JSON strings because the pg cannot handle them properly.
      params.values.forEach((value, i) => {
        if (Array.isArray(value)) {
          params.values[i] = JSON.stringify(value);
        }
      });
    }
  }
  return params;
};

export const end = () => pool.end();
export const query = (sql, client) => (client || pool).query(convertSql(sql)).then(res => res.rows);
export const queryOne = (sql, client) => query(sql, client).then(rows => rows[0]);
export const transaction = executeFunc => new Promise((resolve, reject) =>
  pool.connect((err, client, done) => (
    err ? reject(err) : pgTransact(client, executeFunc, done).then(resolve, reject))));

export const error = {
  ForeignKeyViolation: '23503',
  InvalidDatetimeFormat: '22007',
  UniqueViolation: '23505',
};
