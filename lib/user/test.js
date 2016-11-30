import { queryOne } from 'lib/query';
import { User } from 'lib/user';
import { getTokens, getUsers, has, initDb, request } from 'lib/util/test';

describe('users', () => {
  const { passwords, users } = getUsers();
  let tokens;

  before(initDb);

  describe('POST /api/v1/users', () => {
    after(async () => {
      tokens = await getTokens({ passwords, users });
    });

    const succeed = index => async () => {
      await request
        .post('/api/v1/users')
        .send(Object.assign({ password: passwords[index] }, users[index]))
        .expect(200)
        .expect(({ body: { data } }) => {
          has(data, users[index]);
          users[index].id = data.id;
        });
    };

    it('User1', succeed(0));
    it('User2', succeed(1));
    it('User3', succeed(2));
  });

  describe('GET /api/v1/users', () => {
    before(async () => {
      const role = { admin: true };
      const user = users[0];
      const ret = await queryOne(User.update({ role }).where(User.id.equals(user.id)).returning());
      has(ret, Object.assign(user, { role }));
    });

    it('Unauthorized - Anonymous', async () => {
      await request
        .get('/api/v1/users')
        .expect(401);
    });

    it('Unauthorized - Not administrator', async () => {
      await request
        .get('/api/v1/users')
        .set('Authorization', tokens[1])
        .expect(401);
    });

    it('Success', async () => {
      await request
        .get('/api/v1/users')
        .set('Authorization', tokens[0])
        .expect(200)
        .expect(({ body: { data } }) => {
          has(data, users);
        });
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    describe('Unauthorized', () => {
      it('Anonymous', async () => {
        await request
          .get(`/api/v1/users/${users[0].id}`)
          .expect(401);
      });

      it('Not me', async () => {
        await request
          .get(`/api/v1/users/${users[0].id}`)
          .set('Authorization', tokens[1])
          .expect(401);
      });
    });

    describe('Success', () => {
      const succeed = index => async () => {
        await request
          .get(`/api/v1/users/${users[1].id}`)
          .set('Authorization', tokens[index])
          .expect(200)
          .expect(({ body: { data } }) => {
            has(data, users[1]);
          });
      };

      it('Success - Me', succeed(1));
      it('Success - Administrator', succeed(0));
    });
  });

  describe('PUT /api/v1/users/:userId', () => {
    describe('Unauthorized', () => {
      const update = { username: 'valid' };

      it('Anonymous', async () => {
        await request
          .put(`/api/v1/users/${users[0].id}`)
          .send(update)
          .expect(401);
      });

      it('Not me', async () => {
        await request
          .put(`/api/v1/users/${users[0].id}`)
          .set('Authorization', tokens[1])
          .send(update)
          .expect(401);
      });
    });

    describe('Bad request', () => {
      it('Empty', async () => {
        await request
          .put(`/api/v1/users/${users[1].id}`)
          .set('Authorization', tokens[1])
          .send({})
          .expect(400);
      });
    });

    describe('Internal Server Error', () => {
      it('Empty', async () => {
        await request
          .put(`/api/v1/users/${users[1].id}`)
          .set('Authorization', tokens[1])
          .send({ username: 'c' })
          .expect(500);
      });
    });

    describe('Success', () => {
      const succeed = (index, username) => async () => {
        await request
          .put(`/api/v1/users/${users[1].id}`)
          .set('Authorization', tokens[index])
          .send({ username })
          .expect(200)
          .expect(({ body: { data } }) => {
            const user = users[1];
            user.username = username;
            has(data, user);
          });
      };

      it('Success - Me', succeed(1, 'me'));
      it('Success - Administrator', succeed(0, 'admin'));
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    describe('Unauthorized', () => {
      it('Anonymous', async () => {
        await request
          .delete(`/api/v1/users/${users[0].id}`)
          .expect(401);
      });

      it('Not me', async () => {
        await request
          .delete(`/api/v1/users/${users[0].id}`)
          .set('Authorization', tokens[1])
          .expect(401);
      });
    });

    describe('Success', () => {
      const succeed = (requester, target) => async () => {
        await request
          .delete(`/api/v1/users/${users[target].id}`)
          .set('Authorization', tokens[requester])
          .expect(200)
          .expect(({ body: { data } }) => {
            has(data, users.splice(target, 1)[0]);
          });

        await request
          .get('/api/v1/users')
          .set('Authorization', tokens[0])
          .expect(200)
          .expect(({ body: { data } }) => {
            has(data, users);
          });
      };

      it('Success - Me', succeed(2, 2));
      it('Success - Administrator', succeed(0, 1));
    });
  });
});
