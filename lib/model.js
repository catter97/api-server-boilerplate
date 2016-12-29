import { query, queryOne } from 'lib/query';
import { define } from 'lib/sql';

export default (name, columns) => {
  const model = define(name, columns);
  model.add = (obj, client) => queryOne(model.insert(obj).returning(), client);
  model.all = client => query(model.select().order(model.id.asc), client);
  model.deleteById = (id, client) => queryOne(
    model.delete().where(model.id.equals(id)).returning(), client);
  model.findById = (id, client) => queryOne(model.select().where(model.id.equals(id)), client);
  model.updateById = (obj, id, client) => queryOne(
    model.update(obj).where(model.id.equals(id)).returning(), client);
  return model;
};
