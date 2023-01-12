import { Publisher, Subjects, TicketUpdatedEvent } from '@water-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
