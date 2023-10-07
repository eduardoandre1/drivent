import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function read(roomId: number) {
  const room = await prisma.room.findFirst({ where: { id: roomId } });
  return room;
}
const roomRepository = {
  read,
};
export { roomRepository };
