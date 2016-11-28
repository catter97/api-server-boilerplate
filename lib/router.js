import { Router } from 'express';

export const createRouter = () => { // eslint-disable-line import/prefer-default-export
  const router = new Router();
  const wrap = fn => (req, res, next) => {
    const ret = fn(req, res, next);
    if (ret && typeof ret.catch === 'function') { // It's an async function.
      return ret.catch(next);
    }
    return ret;
  };
  ['get', 'post', 'put', 'delete', 'all'].forEach((method) => {
    const _method = router[method]; // eslint-disable-line no-underscore-dangle
    router[method] = (path, ...args) => {
      args.push(wrap(args.pop()));
      return _method.call(router, path, ...args);
    };
  });
  return router;
};
