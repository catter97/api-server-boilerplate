import defaultConfig from './default';
import production from './production';
import test from './test';

const environmentConfig = { production, test }[process.env.NODE_ENV];

export default Object.assign({}, defaultConfig, environmentConfig);
