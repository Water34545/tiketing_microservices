import request from 'supertest';
import { app } from '../../app';

it('clear the cookie after sing out', async () => {
  await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
      .post('/api/users/singout')
      .send({})
      .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
