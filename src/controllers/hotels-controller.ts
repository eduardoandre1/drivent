import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotelsList(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const hotels = await hotelsService.getHotelsList(userId);
  res.status(httpStatus.OK).json(hotels);
}

export async function getHotelchoesenById(req: AuthenticatedRequest, res: Response) {
  const hotelId = parseInt(req.params.id);
  const userId = req.userId;
  const hotel = await hotelsService.getHotelchoesenById(userId, hotelId);
  res.status(httpStatus.OK).send(hotel);
}
