import { TicketType } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getTicketsService, ticketTypeService } from '@/services/tickets-service';

export async function getTicketsType(req: Request, res: Response) {
  const types = await ticketTypeService();
  console.log(types);
  res.status(httpStatus.OK).send(types);
}
export async function getTickets(req: Request, res: Response) {
  const ticket = await getTicketsService();
  res.status(httpStatus.OK).json(ticket);
}

export async function sendTickets(req: Request, res: Response) {
  const { ticketTypeId } = req.body;
  if (!ticketTypeId) throw { name: 'ticketTypeNotFoundError' };
  // serviçe
  res.status(httpStatus.CREATED);
}
