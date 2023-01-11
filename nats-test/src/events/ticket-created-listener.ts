import { Message } from 'node-nats-streaming';
import { Listener } from './base-listenter';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMassage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('event data', data);

    msg.ack();
  }
}
