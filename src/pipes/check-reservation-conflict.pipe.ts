import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationConflictPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    const { space_id, start_date, end_date } = value;

    const conflict = await this.prisma.reservation.findFirst({
      where: {
        space_id,
        status: { notIn: ['CANCELLED'] },
        OR: [
          {
            start_date: { lte: new Date(end_date) },
            end_date: { gte: new Date(start_date) },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Reservation conflict for the selected time and space');
    }

    return value;
  }
}
