import { Ticket, TicketType, Prisma } from '@prisma/client';
import { prisma } from '@/config';

export async function readType() {
  const type = await prisma.ticketType.findMany();
  return type;
}
export async function readTicket(enrol: number): Promise<Ticket> {
  const ticket = await prisma.ticket.findUnique({ where: { enrollmentId: enrol } });
  return ticket;
}
