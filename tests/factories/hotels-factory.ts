import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotels() {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.city(),
      createdAt: faker.date.between('2020-01-01', '2024-01-01'),
    },
  });
  return hotel;
}
