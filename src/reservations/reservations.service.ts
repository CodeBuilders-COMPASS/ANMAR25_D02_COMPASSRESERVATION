import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { FilterReservationDto } from './dto/filter-reservation.dto';
import { equals } from 'class-validator';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto) {
    const { client_id, space_id, start_date, end_date, resources } = createReservationDto;
  
    const reservation = await this.prisma.reservation.create({
      data: {
        client_id,
        user_id: createReservationDto.user_id,
        space_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        status: ReservationStatus.OPEN,
        reservationResources: {
          create: resources.map(r => ({
            resource_id: r.resource_id,
            quantity: r.quantity,
          })),
        },
      },
    });
  
    for (const res of resources) {
      await this.prisma.resource.update({
        where: { id: res.resource_id },
        data: {
          quantity: {
            decrement: res.quantity,
          },
        },
      });
    }
  
    return reservation;
  }

  async findAll(filterDto: FilterReservationDto) {
    const {
      user_id,
      client_id,
      space_id,
      start_date,
      end_date,
      status,
      page = 1,
      limit = 10,
    } = filterDto;

    const skip = (page - 1) * limit;

    let dateConditions: Prisma.ReservationWhereInput = {}

    if(start_date && end_date){
      dateConditions = {
        AND: [
          { start_date: { lt: end_date } },
          { end_date: { gt: start_date } },
        ],
      };
    } else if (start_date) {
        dateConditions = { start_date: { gte: start_date } }
    } else if (end_date) {
        dateConditions = { end_date: { lte: end_date } }
    }
    const where = {
      user_id: user_id ?? undefined,
      client_id: client_id ?? undefined,
      space_id: space_id ?? undefined,
      status: status ?? undefined,
      ...dateConditions,
    };

    const [count, data] = await Promise.all([
      this.prisma.reservation.count({ where }),
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: true,
          space: true,
          reservationResources: {
            include: {
                resource: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      count,
      pages: Math.ceil(count / limit),
      data,
    };
  }

  async update(id: number, dto: UpdateReservationDto) {
      const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
          reservationResources: true,
      },
      });
  
      if (!reservation) {
      throw new BadRequestException('Reservation not found');
      }
  
      if (reservation.status !== 'OPEN') {
      throw new BadRequestException('Only reservations with status OPEN can be updated');
      }
  
      
      if (dto.resources && dto.resources.length > 0) {
      
      await this.prisma.reservationResource.deleteMany({
          where: { reservation_id: id },
      });
  
      
      await this.prisma.reservationResource.createMany({
          data: dto.resources.map((r) => ({
          reservation_id: id,
          resource_id: r.resource_id,
          quantity: r.quantity,
          })),
      });
      }
  
      const dataToUpdate: any = {
      ...(dto.client_id && { client_id: dto.client_id }),
      ...(dto.space_id && { space_id: dto.space_id }),
      ...(dto.start_date && { start_date: new Date(dto.start_date) }),
      ...(dto.end_date && { end_date: new Date(dto.end_date) }),
      ...(dto.status && { status: dto.status }),
      };
  
      const updatedReservation = await this.prisma.reservation.update({
      where: { id },
      data: dataToUpdate,
      });
  
      return updatedReservation;
  }

  async findOne(reservation: any) {
      return reservation;
  }
  

  async cancel(id: number) {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id },
      });
  
      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }
  
      if (reservation.status !== 'OPEN') {
        throw new BadRequestException('Only reservations with status OPEN can be cancelled');
      }
  
      const updatedReservation = await this.prisma.reservation.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          updated_at: new Date(),
        },
      });
  
      return updatedReservation;
  }
}
