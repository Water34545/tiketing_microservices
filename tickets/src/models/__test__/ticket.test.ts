import { Ticket } from '../ticket';

it('implement optimistic currency control', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 5,
    userId: 'user'
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 10 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not get this point');
});

it('increments a version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 5,
    userId: 'user'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

