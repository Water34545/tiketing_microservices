import { Listener, OrderCreatedEvent, Subjects } from '@water-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMassage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if(!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: data.id });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    });

    msg.ack();
  }
}
