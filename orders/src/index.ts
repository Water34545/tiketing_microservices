import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@water-ticketing/common';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const port = 3000;
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!');
  }

  if (!process.env.NATS_URI) {
    throw new Error('NATS_URI must be defined!');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoose.set('strictQuery', false);

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    natsWrapper.client.on('SIGINT', () => natsWrapper.client.close());
    natsWrapper.client.on('SIGTERM', () => natsWrapper.client.close());

    new TicketUpdatedListener(natsWrapper.client).listen();
    new TicketCreatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }

  app.listen(port, () => {
    console.log(`listening port ${port}`);
  })
}

void start();
