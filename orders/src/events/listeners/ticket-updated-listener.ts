import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@water-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMassage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);

    if(!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
