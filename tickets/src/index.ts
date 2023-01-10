import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@water-ticketing/common';
import { app } from './app';

const port = 3000;
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
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
