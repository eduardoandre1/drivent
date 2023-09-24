import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

type createTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export async function readType(): Promise<TicketType[]> {
  const type = await prisma.ticketType.findMany();
  console.log('repository', type);
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

export async function createTicket(ticketTypeId: number, enrollmentId: number) {
  const ticketMaker = await prisma.ticket.create({
    data: { status: 'RESERVED', enrollmentId: enrollmentId, ticketTypeId: ticketTypeId },
  });
  return ticketMaker;
}
