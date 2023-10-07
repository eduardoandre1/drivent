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
    const putBooking = await server.put('/booking').set('Authorization', `Bearer ${token}`).send({ roomId });
    expect(putBooking.status).toBe(httpStatus.OK);
    expect(putBooking.body).toEqual({ bookingId: booking.id });
  });
});
