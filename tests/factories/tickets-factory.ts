import faker from '@faker-js/faker';
import { Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}
export async function createTicketTypeEspecific(includesHotel: boolean, isRemote: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote,
      includesHotel: includesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
export function FakeTickets(IncludesHotel: boolean, IsRemote: boolean, status: TicketStatus) {
  const ticket = {
    id: parseInt(faker.random.numeric(10)),
    createdAt: faker.datatype.datetime(),
    enrollmentId: parseInt(faker.random.numeric(10)),
    status: status,
    TicketType: {
      id: parseInt(faker.random.numeric()),
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: IsRemote,
      includesHotel: IncludesHotel,
    },
  };
  return ticket;
}
