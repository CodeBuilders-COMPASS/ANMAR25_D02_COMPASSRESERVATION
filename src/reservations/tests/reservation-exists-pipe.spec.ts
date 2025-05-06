import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReservationExistsPipe } from '../../pipes/reservation-exists.pipe';

const prismaMock = {
  reservation: {
    findUnique: jest.fn(),
  },
  onModuleInit: jest.fn(), 
  onModuleDestroy: jest.fn(), 
};

type PrismaMock = typeof prismaMock;

describe('ReservationExistsPipe', () => {
  let reservationExistsPipe: ReservationExistsPipe;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = prismaMock;
    reservationExistsPipe = new ReservationExistsPipe(prisma as any); 
  });

  it('should return the id if the reservation exists', async () => {
    const reservationId = 1;
    prisma.reservation.findUnique.mockResolvedValue({ id: reservationId });

    const result = await reservationExistsPipe.transform(reservationId);

    expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
      where: { id: reservationId },
    });
    expect(result).toBe(reservationId);
  });

  it('should throw NotFoundException if the reservation does not exist', async () => {
    const reservationId = 1;
    prisma.reservation.findUnique.mockResolvedValue(null);

    await expect(
      reservationExistsPipe.transform(reservationId),
    ).rejects.toThrowError(NotFoundException);

    expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
      where: { id: reservationId },
    });
  });
});
