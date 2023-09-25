import { Ticket } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createTicketService, getTicketsService, ticketTypeService } from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsType(req: Request, res: Response) {
  const types = await ticketTypeService();
  console.log(types);
  res.status(httpStatus.OK).send(types);
}
export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  if (!userId) throw { name: 'NotFoundError', message: 'ticket Type id is not valid' };
  const ticket = await getTicketsService(168);
  res.status(httpStatus.OK).json(ticket);
}

export async function sendTickets(req: AuthenticatedRequest, res: Response) {
  const entrada = req.body;
  const userId = req.userId;
  const tickets = await createTicketService(entrada, userId);
  res.status(httpStatus.CREATED).send(tickets);
}
