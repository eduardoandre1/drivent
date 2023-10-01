import { ticketsService } from './tickets-service';
import { enrollmentsService } from '@/services/enrollments-service';
import { notFoundError } from '@/errors';
import { PaymentRequired } from '@/errors/payment-required';
import { hotelsRepository } from '@/repositories/hotels-repository';
import { ticketsRepository } from '@/repositories';

async function getHotelsList(userId: number) {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const includesHotel = ticket.TicketType.includesHotel;
  if (includesHotel === false || ticket.status !== 'PAID') throw PaymentRequired();
  const hotels = await hotelsRepository.findHotels();
  return hotels;
}
async function getHotelchoesenById(userId: number, hotelId: number) {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const includesHotel = ticket.TicketType.includesHotel;
  if (includesHotel === false || ticket.status !== 'PAID') throw PaymentRequired();

  const hotel = await hotelsRepository.findHotelbyID(hotelId);
  return hotel;
}
const hotelsService = {
  getHotelchoesenById,
  getHotelsList,
};
export { hotelsService };
