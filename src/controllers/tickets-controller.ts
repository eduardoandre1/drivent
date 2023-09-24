import { Ticket, TicketType } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createTicketService, getTicketsService, ticketTypeService } from '@/services/tickets-service';

export async function getTicketsType(req: Request, res: Response) {
  const types = await ticketTypeService();
  console.log(types);
  res.status(httpStatus.OK).send(types);
}
export async function getTickets(req: Request, res: Response) {
  const { ticketTypeId } = req.body;
  if (!ticketTypeId) throw { name: 'NotFoundError', message: 'ticket Type id is not valid' };
  const ticket = await getTicketsService(ticketTypeId);
  res.status(httpStatus.OK).json(ticket);
}

export async function sendTickets(req: Request, res: Response) {
  const entrada: Ticket = req.body;
  const tickets = await createTicketService(entrada);
  res.status(httpStatus.CREATED).send(tickets);
}
