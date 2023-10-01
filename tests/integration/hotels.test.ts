import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createHotels } from '../factories/hotels-factory';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('get /hotels autentication ', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();

    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should return a empty array whem the token is valid', async () => {
    //const hotel = await createHotels();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    expect(response.body).toEqual([]);
    expect(response.status).toBe(200);
  });
  it('should return a status 404 when ticket does not exist', async () => {
    //const hotel = await createHotels();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    //await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
  it('should return a status 402 when ticketType incluideshotel is false ', async () => {
    //const hotel = await createHotels();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(402);
  });
  it('should return a status 402 when ticket is reserved  ', async () => {
    //const hotel = await createHotels();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(402);
  });
  it('should return 2 hotels  ', async () => {
    const hotelN1 = await createHotels();
    const hotelN2 = await createHotels();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveLength(2);
  });
  it('should return the hotels whith the especificity format', async () => {
    const hotel = await createHotels();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const response = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
    expect(response.body).toEqual([
      {
        id: hotel.id,
        name: hotel.name,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
        image: hotel.image,
      },
    ]);
  });
});
//describe('get /hotels/:id', () => {})
