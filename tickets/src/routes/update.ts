import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorisedError,
  BadRequestError
} from '@water-ticketing/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title')
      .not()
      .isEmpty()
      .withMessage('title is required'),
    body('price')
      .isFloat({gt: 0})
      .withMessage('price must be grater by 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }
console.log(ticket.orderId)
    if (ticket.orderId) {
      throw new BadRequestError('Can not edit a reserved ticket');
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price
    });

    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    });

    res.send(ticket);
  });

export { router as updateTicketRouter }
