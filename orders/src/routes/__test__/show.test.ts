import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it("fetches an order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.singin();
  const { body: order } = await request(app)
    .post('/api/orders/')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);


  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if another your trying to fetch another users order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.singin();
  const { body: order } = await request(app)
    .post('/api/orders/')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);


  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.singin())
    .send({ ticketId: ticket.id })
    .expect(401);
});
