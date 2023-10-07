import { prisma } from '@/config';

async function readbyId(userId: number) {
  const booking = await prisma.booking.findFirst({
    select: {
      id: true,
      Room: true,
    },
    where: {
      userId: userId,
    },
  });
  return booking;
}
async function countRoom(roomId: number) {
  const booking = await prisma.booking.count({
    where: {
      roomId: roomId,
    },
  });
  return booking;
}

async function create(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
  return booking;
}
async function update(userId: number, roomId: number, bookingId: number) {
  const booking = await prisma.booking.update({
    data: {
      userId: userId,
      roomId: roomId,
    },
    where: {
      id: bookingId,
    },
  });
  return booking;
}
const bookingRepository = {
  readbyId,
  create,
  update,
  countRoom,
};
export { bookingRepository };
