import request from 'supertest';
import { app } from '../../app';

it('respond details about user', async () => {
  const cookie = await global.singin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('respond with null if you are not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send({})
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
