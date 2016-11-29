import { has, init, request } from 'lib/util/test';

describe('login', () => {
  const users = [{
    username: 'a',
    email: 'a@gmail.com',
  }, {
    username: 'b',
    email: 'b@gmail.com',
  }, {
    username: 'c',
    email: 'c@gmail.com',
  }];
  const passwords = ['1', '2', '3'];
  const tokens = [];

  before(async () => {
    await init();

    const createUser = async (index) => {
      await request
        .post('/api/v1/users')
        .send(Object.assign({ password: passwords[index] }, users[index]))
        .expect(200)
        .expect(({ body: { data } }) => {
          has(data, users[index]);
          users[index].id = data.id;
        });
    };

    for (let i = 0; i < users.length; i += 1) {
      await createUser(i);
    }
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
