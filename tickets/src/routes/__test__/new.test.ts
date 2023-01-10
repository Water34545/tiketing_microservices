import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

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
    .set('Cookie', global.singin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.singin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.singin())
    .send({
      price: 10
    })
    .expect(400);
});

it('returns an error if invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.singin())
    .send({
      title: 'test',
      price: -10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.singin())
    .send({
      title: 'test'
    })
    .expect(400);
});

it('creates a ticket with valid parameters', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.singin())
    .send({
      title: 'test',
      price: 20
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});
