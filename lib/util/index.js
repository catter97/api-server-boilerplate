export const isGeneratorFunction = f => // eslint-disable-line import/prefer-default-export
  f.constructor && f.constructor.name === 'GeneratorFunction';
