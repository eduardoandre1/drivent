import { Ticket, TicketType } from '@prisma/client';
import { readTicket, readType } from '@/repositories/tickets-repository';

export async function ticketTypeService() {
  const types = await readType();
  console.log(types);
  return types;
}

export async function getTicketsService(enrol: number | string) {
  if (typeof enrol === 'string') {
    enrol = parseInt(enrol);
  }
  const types = await readTicket(enrol);
  if (!types) throw { name: 'NotFoundError', message: 'not found ticket in database' };
  return types;
}
export async function createTicketService(entrada: Ticket) {
  const types = await readTicket(entrada.ticketTypeId);
  if (!types) throw { name: 'InvalidDataError', message: 'ticket type not found' };
}
