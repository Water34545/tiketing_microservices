import request from 'supertest';
import { app } from '../../app';

it('has route handler listening to /api/tickets for post request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed when the user logged in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title provided', async () => {
});

it('returns an error if invalid price provided', async () => {
});

it('creates a ticket with valid parameters', async () => {
});
