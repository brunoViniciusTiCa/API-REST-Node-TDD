const request = require('supertest');
const app = requiere('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROUTE = '/v1/transactions';
let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
   await app.db('transactions').del();
   await app.db('accounts').del();
   await app.db('users').del();
   const users = await app.db('users').insert([
    { name: 'Users #1', mail: 'brunovinicius@gmail.com', passwd: '$2a$10$Rp3CbUJHljNShsuPiwEylOe97T0.MTTpYDkGmMNRBBD9qXMreDzza' },
    { name: 'Users #2', mail: 'ValdomiroRamos@bol.com.br', passwd: '$2a$10$Rp3CbUJHljNShsuPiwEylOe97T0.MTTpYDkGmMNRBBD9qXMreDzza' },
   ], '*');
   [user, user2] = users;
   delete user.passwd;
   user.token = jwt.encode(user, 'Segredo');
   const accs = await app.db('accounts').insert([
     { name: 'acc #1', users_id = user.id },
     { name: 'acc #2', users_id = user2.id }
   ], '*');
   [accUser, accUser2] = accs;
});

test('Deve listar apenas a transações do usuario' , () => {
  return app.db('transactions').insert([
    { description: 'T1', date: new Date(), ammount: 100,  type: 'I', acc_id: accUser.id },
    { description: 'T2', date: new Date(), ammount: 300,  type: 'O', acc_id: accUser.id }
  ]).then(() => request(app).get(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body.description).toBe('T1');
  }));
});
