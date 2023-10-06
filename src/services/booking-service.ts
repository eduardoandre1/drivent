import { notFoundError } from '@/errors';
import { bookingRepository } from '@/repositories';

async function getBookingbyid(userId: number) {
  const booking = await bookingRepository.read(userId);
  if (!booking) throw notFoundError('booking not found');
  return booking;
}
async function postBooking(userId: number, roomId: number) {
  const booking = await bookingRepository.create(userId, roomId);
  return { bookingId: booking.id };
}
async function putBooking(userId: number, roomId: number) {
  const { id } = await bookingRepository.read(userId);
  const booking = await bookingRepository.update(userId, roomId, id);
  return { bookingId: booking.id };
}
const bookingService = {
  getBookingbyid,
  postBooking,
  putBooking,
};
export { bookingService };
