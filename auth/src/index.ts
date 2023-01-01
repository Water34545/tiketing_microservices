import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currenUserRouter } from './routes/currentuser';
import { singInRouter } from  './routes/singin';
import { singOutRouter } from  './routes/singout';
import { singUpRouter } from  './routes/singup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";

const port = 3000;
const app = express();
app.use(json());
app.use(currenUserRouter);
app.use(singInRouter);
app.use(singOutRouter);
app.use(singUpRouter);

app.all('*', async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening port ${port}`);
})