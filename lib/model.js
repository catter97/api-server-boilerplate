import { query, queryOne } from 'lib/query';
import { define } from 'lib/sql';

const setFindingFunction = (model, name) => {
  const functionName = `findBy${name.charAt(0).toUpperCase() + name.slice(1)}`;
  model[functionName] = (param, client) => // eslint-disable-line no-param-reassign
    queryOne(model.select().where(model[name].equals(param)), client);
};

export default (name, columns) => {
  const model = define(name, columns);
  model.add = (obj, client) => queryOne(model.insert(obj).returning(), client);
  model.all = client => query(model.select().order(model.id.asc), client);
  model.deleteById = (id, client) => queryOne(
    model.delete().where(model.id.equals(id)).returning(), client);
  model.updateById = (obj, id, client) => queryOne(
    model.update(obj).where(model.id.equals(id)).returning(), client);
  columns.forEach(column => setFindingFunction(model, column.name));
  return model;
};
