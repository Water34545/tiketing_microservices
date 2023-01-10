import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('returns the ticket if ticket is valid', async () => {
  const price = 20;
  const title = 'title'

  const respinse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.singin())
    .send({
      title,
      price
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${respinse.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
