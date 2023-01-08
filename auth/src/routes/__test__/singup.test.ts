import request from 'supertest';
import { app } from '../../app';

it('return 201 on successful singUp', async () => {
  return request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('return 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/singup')
    .send({
      email: 'test',
      password: 'password'
    })
    .expect(400);
});

it('return 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'p'
    })
    .expect(400);
});

it('return 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);

  await request(app)
    .post('/api/users/singup')
    .send({
      password: 'password'
    })
    .expect(400);
});

it('disallow duplicate email', async () => {
  await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie after successful singUp', async () => {
  const response = await request(app)
    .post('/api/users/singup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
