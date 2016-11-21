import 'app-module-path/register';
import express from 'express';

import config from 'lib/config';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port);

console.log(`Listening on ${config.port}`); // eslint-disable-line no-console
