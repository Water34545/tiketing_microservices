import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currenUserRouter } from './routes/currentuser';
import { singInRouter } from  './routes/singin';
import { singOutRouter } from  './routes/singout';
import { singUpRouter } from  './routes/singup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";
import {DatabaseConnectionError} from './errors/databaseConnectionError';

const port = 3000;
const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
);
app.use(currenUserRouter);
app.use(singInRouter);
app.use(singOutRouter);
app.use(singUpRouter);

app.all('*', async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
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
