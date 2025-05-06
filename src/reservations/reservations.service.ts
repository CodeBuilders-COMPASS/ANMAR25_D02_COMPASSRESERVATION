import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { FilterReservationDto } from './dto/filter-reservation.dto';
import { Prisma } from '@prisma/client';
import { StatusEnum } from 'src/enums/status.enum';

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
        updated_at: null, 
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
    const { cpf, status, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    let foundClienteId: number | null = null;

    if (cpf) {
      const client = await this.prisma.client.findUnique({
        where: { cpf },
        select: { id: true },
      });

      if (!client) {
        throw new NotFoundException('Not found CPF');
      }

      foundClienteId = client.id;
    }

    const where = {
      status: status ?? undefined,
      client_id: foundClienteId ?? undefined,
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

  async findOne(id: number) {
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
      throw new NotFoundException(`Reservation with ID ${id} not found.`);
    }

    if (reservation.status !== ReservationStatus.OPEN) {
      throw new BadRequestException('Only reservations with status OPEN can be viewed');
    }

    if (!reservation.client || reservation.client.status !== StatusEnum.ACTIVE) {
      throw new BadRequestException('Client is inactive or does not exist');
    }

    if (!reservation.space || reservation.space.status !== StatusEnum.ACTIVE) {
      throw new BadRequestException('Space is inactive or does not exist');
    }

    for (const res of reservation.reservationResources) {
      if (!res.resource || res.resource.status !== StatusEnum.ACTIVE) {
        throw new BadRequestException(`Resource ID ${res.resource_id} is inactive or does not exist`);
      }
    }

    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        reservationResources: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (updateReservationDto.status === ReservationStatus.CANCELLED) {
    throw new BadRequestException("Status cannot be changed to CANCELLED");
    }

    if(reservation.status !== ReservationStatus.OPEN && updateReservationDto.status === ReservationStatus.APPROVED){
      throw new BadRequestException("Only reservations with status OPEN can be updated to APPROVED");
    }

    if(reservation.status !== ReservationStatus.APPROVED && updateReservationDto.status === ReservationStatus.CLOSED){
      throw new BadRequestException("Only reservations with status APPROVED can be updated to CLOSED ");
    }
    
    const dataToUpdate: Prisma.ReservationUpdateInput = {};
    if(updateReservationDto.start_date){
      dataToUpdate.start_date = updateReservationDto.start_date;
    }
    if(updateReservationDto.end_date){
      dataToUpdate.end_date = updateReservationDto.end_date;
    }
    if(updateReservationDto.status){
      dataToUpdate.status = updateReservationDto.status;
    }

    if(updateReservationDto.status === ReservationStatus.CLOSED){
      dataToUpdate.closed_at = new Date();
    }

    return this.prisma.reservation.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async cancel(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.OPEN) {
      throw new BadRequestException('Only reservations with status OPEN can be cancelled');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CANCELLED,
        updated_at: new Date(),
      },
    });
  }
}
