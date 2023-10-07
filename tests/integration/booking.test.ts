import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
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
  });
  it('should return 401 when dont have user ', async () => {
    const token = faker.lorem.word();
    const getBooking = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(getBooking.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
describe('post /booking', () => {
  it('should return 200 when everything allright', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const tycketType = await createTicketType();
    await createTicket(enrollment.id, tycketType.id, TicketStatus.RESERVED);
    const Room = await createRoom();
    const postBooking = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: Room.id });
    console.log(postBooking.body);
    expect(postBooking.status).toBe(httpStatus.CREATED);
  });
});
