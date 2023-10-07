import { User } from '@prisma/client';
import { createRoom } from './room-factory';
import { prisma } from '@/config';

export async function createBooking(user: User) {
  const room = await createRoom();
  const booking = await prisma.booking.create({
    select: {
      id: true,
      Room: true,
    },
    data: {
      roomId: room.id,
      userId: user.id,
    },
  });
  return booking;
}
