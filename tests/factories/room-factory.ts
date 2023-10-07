import faker from '@faker-js/faker';
import { createHotels } from './hotels-factory';
import { prisma } from '@/config';

export async function createRoom(hotelId?: number, capacity?: number) {
  const hotel = await createHotels();
  const Room = await prisma.room.create({
    data: {
      capacity: capacity || parseInt(faker.random.numeric(3)),
      name: faker.name.findName(),
      hotelId: hotel.id || hotelId,
    },
  });
  return Room;
}
