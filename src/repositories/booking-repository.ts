import { prisma } from '@/config';

async function read(userId: number) {
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

async function create(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    select: {
      id: true,
    },
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
  return booking;
}
async function update(userId: number, roomId: number, bookingId: number) {
  const booking = await prisma.booking.update({
    select: {
      id: true,
    },
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
  read,
  create,
  update,
};
export { bookingRepository };
