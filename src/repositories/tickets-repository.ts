import { Ticket } from '@prisma/client';
import { prisma } from '@/config';

type createTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export async function readType() {
  const type = await prisma.ticketType.findMany();

  return type;
}
export async function readTicket(enrol: number): Promise<Ticket> {
  const ticket = await prisma.ticket.findUnique({ where: { enrollmentId: enrol } });
  return ticket;
}

export async function createTicket(ticket: createTicket) {
  const { status, enrollmentId, ticketTypeId } = ticket;
  const createdAt: Date = new Date();
  const ticketMaker = await prisma.ticket.create({
    data: { status, enrollmentId, ticketTypeId, createdAt, updatedAt: createdAt },
  });
  return ticketMaker;
}
