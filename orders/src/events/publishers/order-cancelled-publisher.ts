import { Publisher, Subjects, OrderCancelledEvent } from '@water-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

