// src/reservations/reservations.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReservationDto) {
    // Verifica se espaço existe e está ativo
    const space = await this.prisma.space.findUnique({ where: { id: dto.space_id } });
    if (!space || space.status !== 'ACTIVE') {
      throw new BadRequestException('Espaço inválido ou inativo.');
    }

    // Verifica recursos e suas quantidades
    const validResources = await Promise.all(dto.resources.map(async (item) => {
      const resource = await this.prisma.resource.findUnique({ where: { id: item.resource_id } });
      if (!resource || resource.status !== 'ACTIVE') {
        throw new BadRequestException(`Recurso ${item.resource_id} inválido ou inativo.`);
      }
      if (resource.quantity < item.quantity) {
        throw new BadRequestException(`Quantidade insuficiente do recurso ${resource.name}.`);
      }
      return resource;
    }));

    // Verifica sobreposição de horários
    const overlap = await this.prisma.reservation.findFirst({
      where: {
        space_id: dto.space_id,
        status: { in: ['OPEN', 'APPROVED'] },
        OR: [
          {
            start_date: { lte: new Date(dto.end_date) },
            end_date: { gte: new Date(dto.start_date) },
          }
        ],
      },
    });

    if (overlap) {
      throw new BadRequestException('Já existe uma reserva nesse intervalo.');
    }

    // Cria a reserva
    const reservation = await this.prisma.reservation.create({
      data: {
        user_id: dto.user_id,
        client_id: dto.client_id,
        space_id: dto.space_id,
        start_date: new Date(dto.start_date),
        end_date: new Date(dto.end_date),
        status: 'OPEN',
        reservation_resources: {
          create: dto.resources.map(r => ({
            resource_id: r.resource_id,
            quantity: r.quantity
          })),
        },
      },
    });

    // Atualiza quantidade dos recursos
    for (const r of dto.resources) {
      await this.prisma.resource.update({
        where: { id: r.resource_id },
        data: {
          quantity: { decrement: r.quantity }
        },
      });
    }

    return reservation;
  }
}
