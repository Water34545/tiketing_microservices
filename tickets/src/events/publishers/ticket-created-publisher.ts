import { Publisher, Subjects, TicketCreatedEvent } from '@water-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
