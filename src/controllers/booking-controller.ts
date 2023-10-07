import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';
import { unauthorizedError } from '@/errors';

async function getBookingbyid(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  if (!userId) throw unauthorizedError();
  const booking = await bookingService.getBookingbyid(userId);
  res.status(httpStatus.OK).send(booking);
}
async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  if (!userId) throw unauthorizedError();
  const { roomId } = req.body;
  const booking = await bookingService.postBooking(userId, roomId);
  res.status(httpStatus.OK).send(booking);
}
async function putBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  if (!userId) throw unauthorizedError();
  const { roomId } = req.body;
  const booking = await bookingService.putBooking(userId, roomId);
  res.status(httpStatus.OK).send(booking);
}
const bookingController = {
  getBookingbyid,
  postBooking,
  putBooking,
};
export { bookingController };
