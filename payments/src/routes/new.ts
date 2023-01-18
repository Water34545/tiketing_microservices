import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorisedError, NotFoundError, OrderStatus, requireAuth } from '@water-ticketing/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import {PaymentCreatedPublisher} from '../events/publishers/payment-created-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('userId')
      .not()
      .isEmpty()
  ],
  async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorisedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for a canceled order');
  }

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price*100,
    source: token
  });

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  });
  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    stripeId: charge.id,
    orderId
  });

  res.status(201).send({ id: payment.id });
});

export { router as createChargeRouter };
