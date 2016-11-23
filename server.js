import 'app-module-path/register';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';

import api from 'lib/api';
import auth from 'lib/auth';
import config from 'lib/config';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(auth.initialize());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', auth.authenticate('local', { session: false }), (req, res) => {
  req.user.password = undefined; // eslint-disable-line no-param-reassign
  res.json(req.user);
});

app.use('/api', api);

app.listen(config.port);

console.log(`Listening on ${config.port}`); // eslint-disable-line no-console
