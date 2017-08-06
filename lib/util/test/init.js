/* eslint-disable no-await-in-loop */

import { createAllTables, dropAllTables } from 'script/db';
import request from './request';

export const createUsers = async ({ passwords, users }) => {
  const createUser = async (index) => {
    await request
      .post('/api/v1/users')
      .send(Object.assign({ password: passwords[index] }, users[index]))
      .expect(200)
      .expect(({ body: { data } }) => {
        users[index].id = data.id; // eslint-disable-line no-param-reassign
      });
  };

  for (let i = 0; i < users.length; i += 1) {
    await createUser(i);
  }
};

export const initDb = async () => {
  await dropAllTables();
  await createAllTables();
};

export const getTokens = async ({ passwords, users }) => {
  const tokens = [];
  const getToken = async (index) => {
    await request
      .post('/api/v1/login')
      .send({ username: users[index].username, password: passwords[index] })
      .expect(200)
      .expect((res) => {
        const { body: { data } } = res;
        tokens[index] = `Bearer ${data.token}`;
      });
  };

  for (let i = 0; i < users.length; i += 1) {
    await getToken(i);
  }
  return tokens;
};

export const getUsers = () => ({
  passwords: ['1', '2', '3'],
  users: [{
    username: 'a',
    email: 'a@gmail.com',
  }, {
    username: 'b',
    email: 'b@gmail.com',
  }, {
    username: 'c',
    email: 'c@gmail.com',
  }],
});
