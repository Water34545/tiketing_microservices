import express, { Request, Response} from 'express';
import { NotAuthorisedError, NotFoundError, requireAuth } from '@water-ticketing/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorisedError();
  }

  order.status = OrderStatus.Cancelled;
  order.save();

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
