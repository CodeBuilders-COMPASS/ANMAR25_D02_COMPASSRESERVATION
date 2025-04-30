import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReservationDto) {
    const { client_id, space_id, start_date, end_date, resources } = data;

    // Verifica se o cliente existe e está ativo
    const client = await this.prisma.client.findUnique({ where: { id: client_id } });
    if (!client || client.status !== 'ACTIVE') {
      throw new BadRequestException('Inactive or nonexistent client');
    }

    // Verifica se o espaço existe e está ativo
    const space = await this.prisma.space.findUnique({ where: { id: space_id } });
    if (!space || space.status !== 'ACTIVE') {
      throw new BadRequestException('Inactive or nonexistent space');
    }

    // Valida os recursos
    for (const res of resources) {
      const resource = await this.prisma.resource.findUnique({ where: { id: res.resource_id } });
      if (!resource || resource.status !== 'ACTIVE') {
        throw new BadRequestException(`Inactive or nonexistent resource ID ${res.resource_id}`);
      }
      if (resource.quantity < res.quantity) {
        throw new BadRequestException(`Insufficient quantity for resource ${resource.name}`);
      }
    }

    // Verifica se já existe conflito de horário
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

    // Cria a reserva
    const reservation = await this.prisma.reservation.create({
      data: {
        client_id,
        user_id: data.user_id,
        space_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        status: 'OPEN',
        reservationResources: {
          create: resources.map(r => ({
            resource_id: r.resource_id,
            quantity: r.quantity,
          })),
        },
      },
    });

    // Atualiza as quantidades dos recursos
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

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        client: true,
        space: true,
        reservationResources: {
          include: {
            resource: true,
          },
        },
      },
    });
  
    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }
  
    if (reservation.status !== 'OPEN') {
      throw new BadRequestException('Only reservations with status OPEN can be updated');
    }
  
    if (!reservation.client || reservation.client.status !== 'ACTIVE') {
      throw new BadRequestException('Client is inactive or does not exist');
    }
  
    if (!reservation.space || reservation.space.status !== 'ACTIVE') {
      throw new BadRequestException('Space is inactive or does not exist');
    }
  
    // Verifica e valida os recursos, se forem enviados
    if (dto.resources && dto.resources.length > 0) {
      for (const res of dto.resources) {
        const resource = await this.prisma.resource.findUnique({ where: { id: res.resource_id } });
        if (!resource || resource.status !== 'ACTIVE') {
          throw new BadRequestException(`Inactive or nonexistent resource ID ${res.resource_id}`);
        }
        if (resource.quantity < res.quantity) {
          throw new BadRequestException(`Insufficient quantity for resource ${resource.name}`);
        }
      }
  
      // Remove recursos antigos
      await this.prisma.reservationResource.deleteMany({
        where: { reservation_id: id },
      });
  
      // Cria novos recursos
      await this.prisma.reservationResource.createMany({
        data: dto.resources.map((r) => ({
          reservation_id: id,
          resource_id: r.resource_id,
          quantity: r.quantity,
        })),
      });
    }
  
    // Prepara os dados dinamicamente (não envia undefined para o Prisma)
    const dataToUpdate: any = {
      ...(dto.client_id !== undefined && { client_id: dto.client_id }),
      ...(dto.space_id !== undefined && { space_id: dto.space_id }),
      ...(dto.start_date !== undefined && { start_date: new Date(dto.start_date) }),
      ...(dto.end_date !== undefined && { end_date: new Date(dto.end_date) }),
      ...(dto.status !== undefined && { status: dto.status }),
    };
  
    const updatedReservation = await this.prisma.reservation.update({
      where: { id },
      data: dataToUpdate,
    });
  
    return updatedReservation;
  }
  

  async findAll(page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;

    const totalReservations = await this.prisma.reservation.count();
    const totalPages = Math.ceil(totalReservations / take);

    const reservations = await this.prisma.reservation.findMany({
      skip,
      take,
      include: {
        client: true,
        space: true,
        reservationResources: {
          include: {
            resource: true,
          },
        },
      },
    });

    return {
      reservations,
      totalPages,
      totalReservations,
    };
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        client: true,
        space: true,
        reservationResources: {
          include: {
            resource: true,
          },
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
