import { Router } from 'express';
import { NotFound } from 'http-errors';
import statuses from 'statuses';

import v1 from 'lib/api/v1';

const responseMiddleware = (req, res, next) => {
  res.data = data => res.json({ status: { code: 200 }, data }); // eslint-disable-line no-param-reassign
  next();
};

const defaultHandler = (req, res, next) => {
  next(new NotFound());
};

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const code = err.status || err.statusCode || 500;
  res.status(code);

  const status = {
    code,
    description: statuses[code],
  };
  const body = { status };
  if (req.app.get('env') === 'development') {
    status.message = err.message;
    body.stack = err.stack.split('\n    ');

    if (code >= 500) {
      console.error(err.stack); // eslint-disable-line no-console
    }
  }
  res.json(body);
};

export default new Router()
  .use(responseMiddleware)
  .use('/v1', v1)
  .use(defaultHandler)
  .use(errorHandler);
