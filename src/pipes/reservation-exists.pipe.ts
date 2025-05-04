import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationExistsPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return id;
  }
}