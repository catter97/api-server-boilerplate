import { Router } from 'express';

import { isGeneratorFunction } from 'lib/util';

export const createRouter = () => { // eslint-disable-line import/prefer-default-export
  const router = new Router();
  const wrap = (fn) => {
    if (isGeneratorFunction(fn)) {
      return (...args) => fn(...args).catch(args[2]);
    }
    return fn;
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
