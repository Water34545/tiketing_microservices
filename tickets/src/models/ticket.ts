import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ticketAttrs {
  title: string;
  userId: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: ticketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  userId: string;
  price: number;
  version: number;
  orderId?: string;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  userId: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  orderId: {
    type: String,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ticketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
