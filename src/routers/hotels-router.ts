import { Router } from 'express';
import { getHotelchoesenById, getHotelsList } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();
hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', getHotelsList);
hotelsRouter.get('/:id', getHotelchoesenById);
export { hotelsRouter };
