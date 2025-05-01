import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationExistsPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        client: true,
        space: true,
        reservationResources: {
          include: { resource: true },
        },
      },
    });

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    if (reservation.status !== 'OPEN') {
      throw new BadRequestException('Only reservations with status OPEN can be viewed');
    }

    if (!reservation.client || reservation.client.status !== 'ACTIVE') {
      throw new BadRequestException('Client is inactive or does not exist');
    }

    if (!reservation.space || reservation.space.status !== 'ACTIVE') {
      throw new BadRequestException('Space is inactive or does not exist');
    }

    for (const res of reservation.reservationResources) {
      if (!res.resource || res.resource.status !== 'ACTIVE') {
        throw new BadRequestException(`Resource ID ${res.resource_id} is inactive or does not exist`);
      }
    }

    return reservation; // retorna o objeto completo validado
  }
}
