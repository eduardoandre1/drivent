import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';
import { notFoundError } from '@/errors';

async function findWithAddressByUserId(userId: number) {
  const enrol = await prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
  if (!enrol) throw notFoundError();
  return enrol;
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

export const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
};
