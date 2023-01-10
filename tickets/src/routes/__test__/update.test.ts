import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if the provided id is not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.singin())
    .send({
      title: 'test',
      price: 20
    })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 20
    })
    .expect(401);
});

it('returns 401 if the user is not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.singin())
    .send({
      title: 'test',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.singin())
    .send({
      title: 'test2',
      price: 200
    })
    .expect(401);
});

it('returns 400 if the user provided invalid title or price', async () => {
  const cookie = global.singin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 200
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'testtest',
      price: -5
    })
    .expect(400);
});

it('update the ticket provided valid inputs', async () => {
  const cookie = global.singin();
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'testtest',
      price: 200
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('testtest');
  expect(ticketResponse.body.price).toEqual(200);
});
