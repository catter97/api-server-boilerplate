import sql from 'sql';

sql.setDialect('postgres');

const field = dataType => (name, opts) => Object.assign({ name, dataType }, opts);

export const define = (name, columns) => sql.define({ name, columns }); // eslint-disable-line import/no-named-as-default-member
export const id = () => ({ name: 'id', dataType: 'serial', primaryKey: true });
export const json = field('jsonb');
export const text = field('text');
