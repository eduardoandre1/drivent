import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

type createTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export async function readType(): Promise<TicketType[]> {
  const type = await prisma.ticketType.findMany();
  console.log('repository', type);
  const array = [type];
  return type;
}
export async function readTicket(enrol: number): Promise<Ticket> {
  const ticket = await prisma.ticket.findFirst({
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { enrollmentId: enrol },
  });

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
