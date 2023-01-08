import request from 'supertest';
import { app } from '../../app';

it('falls when email does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/singin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});
it('falls when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/singin')
    .send({
      email: 'test@test.com',
      password: 'password1'
    })
    .expect(400);
});
it('response with e cookie with a valid credentials', async () => {
  await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/singin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
