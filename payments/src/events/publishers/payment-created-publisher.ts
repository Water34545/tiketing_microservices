import { PaymentCreatedEvent, Publisher, Subjects } from '@water-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
