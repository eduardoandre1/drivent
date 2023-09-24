import { Router } from 'express';
import { getTickets, getTicketsType, sendTickets } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();
ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getTicketsType);
ticketsRouter.get('/', getTickets);
ticketsRouter.post('/', sendTickets);

export { ticketsRouter };
