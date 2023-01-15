import express, { Request, Response } from 'express';
import {NotAuthorisedError, NotFoundError, requireAuth} from '@water-ticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorisedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
