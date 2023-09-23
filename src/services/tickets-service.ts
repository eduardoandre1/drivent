import { TicketType } from '@prisma/client';
import { readTicket, readType } from '@/repositories/tickets-repository';

export async function ticketTypeService() {
  const types = await readType();
  return types;
}

export async function getTicketsService() {
  const enrol = 5;
  const types = await readTicket(enrol);
  return types;
}
