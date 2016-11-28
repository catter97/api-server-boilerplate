import 'app-module-path/register';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';

import 'lib/auth';
import api from 'lib/api';
import config from 'lib/config';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use('/api', api);

app.listen(config.port);

console.log(`Listening on ${config.port}`); // eslint-disable-line no-console
