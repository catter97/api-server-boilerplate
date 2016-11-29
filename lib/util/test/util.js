import { expect } from 'chai';

const hasOne = (obj, expected) => {
  const picked = {};
  Object.keys(expected).forEach(key => (picked[key] = obj[key]));
  expect(picked).to.eql(expected);
};

export const has = (obj, expected) => { // eslint-disable-line import/prefer-default-export
  if (Array.isArray(obj)) {
    if (!Array.isArray(expected) || obj.length !== expected.length) {
      expect(obj).to.eql(expected);
    } else {
      for (let i = 0; i < obj.length; i += 1) {
        hasOne(obj[i], expected[i]);
      }
    }
  } else {
    hasOne(obj, expected);
  }
};
