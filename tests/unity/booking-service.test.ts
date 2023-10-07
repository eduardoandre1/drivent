import faker from '@faker-js/faker';
import { createEnrollmentWithAddress } from '../factories';
import { bookingService } from '@/services';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

describe('get booking', () => {
  it('return status 401 when dont find user ', async () => {
    const getBooking = bookingService.getBookingbyid(undefined);
    expect(getBooking).rejects.toEqual({
      name: 'UnauthorizedError',
      message: 'You must be signed in to continue',
    });
  });
  it('should return status 404 when not found Booking', async () => {
    jest.spyOn(bookingRepository, 'readbyId').mockImplementationOnce(() => {
      return undefined;
    });
    const getBooking = bookingService.getBookingbyid(parseInt(faker.random.numeric(3)));
    expect(getBooking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'booking not found',
    });
  });
});
describe('post booking', () => {
  it('should return status 401 when dont find user ', async () => {
    const roomId = parseInt(faker.random.numeric(5));
    const postBooking = bookingService.postBooking(undefined, roomId);
    expect(postBooking).rejects.toEqual({
      name: 'UnauthorizedError',
      message: 'You must be signed in to continue',
    });
  });
  it('shoul return status 403 when dont find enrollment', async () => {
    const roomId = parseInt(faker.random.numeric(5));
    const userId = parseInt(faker.random.numeric(5));

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(() => {
      return undefined;
    });

    const postBooking = bookingService.postBooking(userId, roomId);
    expect(postBooking).rejects.toEqual({
      name: 'Forbidden',
      message: 'you must have a enrollment to booking a Room',
    });
  });
  it('should return status 403 when dont find ticket', async () => {
    const roomId = parseInt(faker.random.numeric(5));
    const userId = parseInt(faker.random.numeric(5));
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return createEnrollmentWithAddress();
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(() => {
      return undefined;
    });
    const postBooking = bookingService.postBooking(userId, roomId);
    expect(postBooking).rejects.toEqual({
      name: 'Forbidden',
      message: 'you must have a ticket to booking a Room',
    });
  });
});
