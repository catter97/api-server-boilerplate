import defaultConfig from './default';
import production from './production';

const environmentConfig = { production }[process.env.NODE_ENV];

export default Object.assign({}, defaultConfig, environmentConfig);
