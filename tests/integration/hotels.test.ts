import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { Hotel } from '@prisma/client';
import { createHotels } from '../factories/hotels-factory';
import { createEnrollmentWithAddress, createTicket, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
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
    const hotel = await createHotels();
    const token = await generateValidToken();
    const user = await createUser();
    //await createEnrollmentWithAddress(user.id)
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.body).toEqual([
      {
        id: hotel.id,
        createdAt: hotel.createdAt.toISOString(),
        image: hotel.image,
        name: hotel.name,
        updatedAt: hotel.updatedAt.toISOString(),
      },
    ]);
  });
});
