import mongoose from 'mongoose';

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
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: ticketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
