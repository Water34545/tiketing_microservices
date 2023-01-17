import { TicketUpdatedEvent } from '@water-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version+1,
    title: 'new concert',
    price: 200,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, ticket, msg }
}
it('finds, update and saves a ticket', async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMassage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await  setup();
  await listener.onMassage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not akc an event if the version is in the feature', async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;

  try {
    await listener.onMassage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
