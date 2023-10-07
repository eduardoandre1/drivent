import { notFoundError } from '@/errors';
import { ForbiddenError } from '@/errors/Forbidden-error';
import { bookingRepository, roomRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function getBookingbyid(userId: number) {
  const booking = await bookingRepository.readbyId(userId);
  if (!booking) throw notFoundError('booking not found');
  return booking;
}
async function postBooking(userId: number, roomId: number) {
  // validação de ticket
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw ForbiddenError('you must have a enrollment to booking a Room');

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw ForbiddenError('you must have a ticket to booking a Room');

  const includesHotel = ticket.TicketType.includesHotel;
  const isRemote = ticket.TicketType.isRemote;
  if (includesHotel === false || ticket.status !== 'PAID' || isRemote === true)
    throw ForbiddenError('your ticket is not allowed to get a room verification if includes hotel or is paid ');
  //
  const room = await roomRepository.read(roomId);
  if (!room) throw notFoundError('room not found');

  const countRoom = await bookingRepository.countRoom(roomId);
  if (room.capacity <= countRoom) throw ForbiddenError('you cannot booking this room because is full capacity');

  const booking = await bookingRepository.create(userId, roomId);
  return { bookingId: booking.id };
}
async function putBooking(userId: number, roomId: number) {
  const bookingOld = await bookingRepository.readbyId(userId);
  if (!bookingOld)
    throw ForbiddenError(
      'you need a booking to update if you already have a booking please try again or contact the administrator',
    );

  const room = await roomRepository.read(roomId);
  if (!room) throw notFoundError('not found the room');

  const countRoom = await bookingRepository.countRoom(roomId);
  if (room.capacity <= countRoom) throw ForbiddenError('you cannot booking this room because is full capacity');

  const bookingUpdate = await bookingRepository.update(userId, roomId, bookingOld.id);
  return { bookingId: bookingUpdate.id };
}
const bookingService = {
  getBookingbyid,
  postBooking,
  putBooking,
};
export { bookingService };
