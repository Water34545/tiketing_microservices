import { TicketCreatedEvent } from '@water-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 20,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}
it('creates and saves tickets', async () => {
  const { listener, data, msg } = await  setup();
  await listener.onMassage(data, msg);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await  setup();
  await listener.onMassage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
