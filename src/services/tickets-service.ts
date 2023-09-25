import { Ticket } from '@prisma/client';
import { createTicket, readTicket, readType } from '@/repositories/tickets-repository';
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
export async function createTicketService(ticketTypeId: number | string, userId: number | string) {
  if (typeof userId === 'string') {
    userId = parseInt(userId);
  }
  if (typeof ticketTypeId === 'string') {
    ticketTypeId = parseInt(ticketTypeId);
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw { name: 'NotFoundError', message: 'not found enrollment in database' };
  if (ticketTypeId === undefined) throw { name: 'EnrollmentNotFoundError' };
  const ticket = await createTicket(ticketTypeId, enrollment.id);
  return ticket;
}
