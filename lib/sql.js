import camelCase from 'camelcase';
import { define as sqlDefine } from 'sql';

const field = dataType => (name, opts) => Object.assign({ name, dataType }, opts);

export const createdAt = {
  name: 'createdAt',
  dataType: 'timestamp with time zone default CURRENT_TIMESTAMP',
};
export const define = (name, columns) => sqlDefine({ name, columns });
export const id = () => ({ name: 'id', dataType: 'serial', primaryKey: true });
export const int = field('int');
export const json = field('jsonb');
export const text = field('text');

export const refer = (model, opts) => Object.assign({
  name: `${camelCase(model)}Id`,
  dataType: 'int',
  references: { table: `${model}s`, column: 'id' },
}, opts);
