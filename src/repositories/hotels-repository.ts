import { prisma } from '@/config';

async function findHotels() {
  const hotels = await prisma.hotel.findMany();
  return hotels;
}
async function findHotelbyID(id: number) {
  const hotel = await prisma.hotel.findUnique({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      Rooms: true,
    },
    where: { id },
  });
  return hotel;
}
const hotelsRepository = {
  findHotels,
  findHotelbyID,
};
export { hotelsRepository };
