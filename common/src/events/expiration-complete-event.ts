import { Subjects } from './subjects';

export interface ExpirationCompleteEvent {
  subject: Subjects.OrderCreated;
  data: {
    orderId: string;
  }
}
