import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypeEspecific,
  createUser,
  FakeTickets,
  fakeEnrollment,
} from '../factories';
import { createBooking } from '../factories/booking-factory';
import { createRoom } from '../factories/room-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);
describe('get /booking', () => {
  it('should return 200 when evething allright', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const booking = await createBooking(user);
    const getBooking = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(getBooking.status).toBe(httpStatus.OK);
    expect(getBooking.body).toEqual({
      id: booking.id,
      Room: {
        capacity: booking.Room.capacity,
        hotelId: booking.Room.hotelId,
        name: booking.Room.name,
        createdAt: booking.Room.createdAt.toISOString(),
        updatedAt: booking.Room.updatedAt.toISOString(),
        id: booking.Room.id,
      },
    });
  });
  it('should return 401 when dont have user ', async () => {
    const token = faker.lorem.word();
    const getBooking = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(getBooking.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should return 404 when dont have a booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
  });
});
describe('post /booking', () => {
  it('should return 200 when everything allright', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const tycketType = await createTicketTypeEspecific(true, false);
    await createTicket(enrollment.id, tycketType.id, TicketStatus.PAID);
    const Room = await createRoom();
    const postBooking = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: Room.id });
    expect(postBooking.status).toBe(httpStatus.OK);
    expect(postBooking.body).toEqual({ bookingId: expect.any(Number) });
  });
});
describe('put /booking', () => {
  it('should return 200 when everything allright', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const booking = await createBooking(user);
    const roomId = booking.Room.id;
    const putBooking = await server
      .put(`/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId });
    expect(putBooking.status).toBe(httpStatus.OK);
    expect(putBooking.body).toEqual({ bookingId: booking.id });
  });
  it('should return 403 when dont exist booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const roomId = faker.random.numeric(5);
    const bookingId = faker.random.numeric(5);
    const putBooking = await server
      .put(`/booking/${bookingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId });
    expect(putBooking.status).toBe(httpStatus.FORBIDDEN);
  });
  it('should return 404 when dont exist room', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const booking = await createBooking(user);
    const roomId = parseInt(faker.random.numeric(2));
    const putBooking = await server
      .put(`/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId });
    expect(putBooking.status).toBe(httpStatus.NOT_FOUND);
  });
});

import { bookingService } from '@/services';
import { bookingRepository, enrollmentRepository, roomRepository, ticketsRepository } from '@/repositories';

describe('get booking', () => {
  it('return status 401 when dont find user ', async () => {
    const getBooking = bookingService.getBookingbyid(undefined);
    expect(getBooking).rejects.toEqual({
      name: 'UnauthorizedError',
      message: 'You must be signed in to continue',
    });
  });
  it('should return status 404 when not found Booking', async () => {
    jest.spyOn(bookingRepository, 'readbyuserId').mockImplementationOnce(() => {
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
  it('should return status 403 when dont find ticket', () => {
    const roomId = parseInt(faker.random.numeric(5));
    const userId = parseInt(faker.random.numeric(5));
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return fakeEnrollment();
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return undefined;
    });
    const postBooking = bookingService.postBooking(userId, roomId);
    expect(postBooking).rejects.toEqual({
      name: 'Forbidden',
      message: 'you must have a ticket to booking a Room',
    });
  });
  it('should return status 404 when dont find room ', () => {
    const roomId = parseInt(faker.random.numeric(5));
    const userId = parseInt(faker.random.numeric(5));
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return fakeEnrollment();
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return FakeTickets(true, false, 'PAID');
    });
    jest.spyOn(roomRepository, 'read').mockImplementationOnce((): any => {
      return undefined;
    });
    const postBooking = bookingService.postBooking(userId, roomId);
    expect(postBooking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'room not found',
    });
  });
});
