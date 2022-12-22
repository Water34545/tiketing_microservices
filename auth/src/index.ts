import express from 'express';
import { json } from 'body-parser';

const port = 3000;
const app = express();
app.use(json());

app.listen(port, () => {
  console.log(`listening port ${port}`);
})