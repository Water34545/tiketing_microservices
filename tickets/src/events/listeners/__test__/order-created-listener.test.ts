import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@water-ticketing/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: '100',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg };
}

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMassage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
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
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
