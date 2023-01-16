import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@water-ticketing/common';
import { natsWrapper } from '../../nats-wrapper';

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders/')
    .set('Cookie', global.singin())
    .send({ ticketId })
    .expect(404)
});
it("returns an error if the ticket already reserved", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    userId: 'testtest',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  await request(app)
    .post('/api/orders/')
    .set('Cookie', global.singin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  await request(app)
    .post('/api/orders/')
    .set('Cookie', global.singin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emin an order created event", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  await request(app)
    .post('/api/orders/')
    .set('Cookie', global.singin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
