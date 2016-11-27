import sql from 'sql';

sql.setDialect('postgres');

export const define = (name, columns) => sql.define({ name, columns }); // eslint-disable-line import/no-named-as-default-member
export const id = () => ({ name: 'id', dataType: 'serial', primaryKey: true });
export const text = (name, opts) => Object.assign({ name, dataType: 'text' }, opts);

export default {
  define,
  id,
  text,
};
