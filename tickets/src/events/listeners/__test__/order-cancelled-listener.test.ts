import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@water-ticketing/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import {OrderCancelledListener} from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set(orderId);
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg };
}

it('update the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMassage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it('calls the ack massage', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMassage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publish a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMassage(data, msg);
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(ticketUpdatedData.orderId).toEqual(undefined);
});
