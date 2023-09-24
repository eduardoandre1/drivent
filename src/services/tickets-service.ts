import { Ticket, TicketType } from '@prisma/client';
import { readTicket, readType } from '@/repositories/tickets-repository';
import { enrollmentRepository } from '@/repositories';

export async function ticketTypeService() {
  const types = await readType();
  console.log(types);
  return types;
}

export async function getTicketsService(userId: number | string) {
  if (typeof userId === 'string') {
    userId = parseInt(userId);
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw { name: 'NotFoundError', message: 'not found enrollment in database' };
  const ticket = await readTicket(enrollment.id);
  if (!ticket) throw { name: 'NotFoundError', message: 'not found ticket in database' };
  return ticket;
}
export async function createTicketService(entrada: Ticket) {
  const types = await readTicket(entrada.ticketTypeId);
  if (!types) throw { name: '', message: 'ticket type not found' };
}
