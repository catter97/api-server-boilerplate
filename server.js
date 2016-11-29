import 'app-module-path/register';

import app from 'lib/app';
import config from 'lib/config';

app.listen(config.port);

console.log(`Listening on ${config.port}`); // eslint-disable-line no-console
