import 'app-module-path/register';
import express from 'express';
import morgan from 'morgan';

import api from 'lib/api';
import config from 'lib/config';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', api);

app.listen(config.port);

console.log(`Listening on ${config.port}`); // eslint-disable-line no-console
