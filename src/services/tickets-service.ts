import { TicketType } from '@prisma/client';
import { readTicket, readType } from '@/repositories/tickets-repository';

export async function ticketTypeService() {
  const types = await readType();
  console.log();
  if (types.length === 0) {
    return [];
  }
  return types;
}

export async function getTicketsService() {
  const enrol = 5;
  const types = await readTicket(enrol);
  if (!types) throw { name: 'NotFoundError', message: 'not found ticket in database' };
  return types;
}
