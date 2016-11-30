import { createUsers, getUsers, has, initDb, request } from 'lib/util/test';

describe('login', () => {
  const { passwords, users } = getUsers();
  const tokens = [];

  before(async () => {
    await initDb();
    await createUsers({ passwords, users });
  });

  describe('POST /api/v1/login', () => {
    it('GET /api/v1/login - Unauthorized', async () => {
      await request
        .get('/api/v1/login')
        .expect(401);
    });

    describe('Bad Request:', () => {
      const bad = user => async () => {
        await request
          .post('/api/v1/login')
          .send(user)
          .expect(400);
      };

      it('Nothing', bad());
      it('Only username', bad({ username: users[0].username }));
      it('Only email', bad({ username: users[0].email }));
      it('Only email', bad({ password: passwords[0] }));
    });

    describe('Unauthorized:', () => {
      const un = username => async () => {
        await request
          .post('/api/v1/login')
          .send({ username, password: 'invalid' })
          .expect(401);
      };

      it('Username and wrong password', un(users[0].username));
      it('Email and wrong password', un(users[0].email));
    });

    describe('OK(including GET /api/v1/login):', () => {
      let cookie;
      const succeed = (index, field) => async () => {
        await request
          .post('/api/v1/login')
          .send({ username: users[index][field], password: passwords[index] })
          .expect(200)
          .expect((res) => {
            const { body: { data } } = res;
            has(data, users[index]);
            tokens[index] = `Bearer ${data.token}`;
            cookie = res.headers['set-cookie'].pop().split(';')[0];
          });

        await request
          .get('/api/v1/login')
          .set('Cookie', cookie)
          .expect(200)
          .expect(({ body: { data } }) => has(data, users[index]));
      };

      it('By username', succeed(0, 'username'));
      it('By email', succeed(1, 'email'));
      it('User3', succeed(2, 'username'));
    });
  });
});
