import { Publisher, Subjects, ExpirationCompleteEvent } from '@water-ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
