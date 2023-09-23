import { Router } from 'express';
import { getTickets, getTicketsType } from '@/controllers/tickets-controller';

const ticketsRouter = Router();
ticketsRouter.get('/types', getTicketsType);
ticketsRouter.get('/', getTickets);

export { ticketsRouter };
