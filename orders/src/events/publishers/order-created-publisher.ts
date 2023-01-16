import { Publisher, Subjects, OrderCreatedEvent } from '@water-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
