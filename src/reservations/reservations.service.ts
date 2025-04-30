import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';

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
        resources: {
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
        // Busca a reserva
        const reservation = await this.prisma.reservation.findUnique({
            where: { id },
            include: {
              client: true,
              space: true,
              resources: {
                include: {
                  resource: true,
                },
              },
            },
          });
          
    
        if (!reservation) {
        throw new BadRequestException('Reservation not found');
        }
    
        // Verifica se a reserva está com status OPEN
        if (reservation.status !== 'OPEN') {
        throw new BadRequestException('Only reservations with status OPEN can be updated');
        }
    
        // Verifica se o cliente está ativo
        if (!reservation.client || reservation.client.status !== 'ACTIVE') {
        throw new BadRequestException('Client is inactive or does not exist');
        }
    
        // Verifica se o espaço está ativo
        if (!reservation.space || reservation.space.status !== 'ACTIVE') {
        throw new BadRequestException('Space is inactive or does not exist');
        }
    
        // Atualiza parcialmente a reserva com os dados recebidos no DTO
        const updatedReservation = await this.prisma.reservation.update({
        where: { id },
        data: dto,  // Atualiza com os dados recebidos no DTO
        });
    
        return updatedReservation;
    }
  

  // reservations.service.ts
    async findAll(page: number = 1) {
        const take = 10; // Limita 10 resultados por página
        const skip = (page - 1) * take;
    
        // Conta o número total de reservas
        const totalReservations = await this.prisma.reservation.count();
    
        // Calcula o número total de páginas
        const totalPages = Math.ceil(totalReservations / take);
    
        // Busca as reservas da página solicitada
        const reservations = await this.prisma.reservation.findMany({
        skip,
        take,
        include: {
            client: true,
            space: true,
            resources: {
            include: {
                resource: true,
            },
            },
        },
        });
    
        // Retorna as reservas e o total de páginas
        return {
        reservations,
        totalPages,  // Inclui o número total de páginas
        totalReservations,  // Também podemos retornar o total de reservas
        };
    }
  
    async findOne(id: number) {
        // Busca a reserva
        const reservation = await this.prisma.reservation.findUnique({
          where: { id },
          include: {
            client: true,
            space: true,
            resources: {
              include: {
                resource: true,
              },
            },
          },
        });
      
        // Se não existir
        if (!reservation) {
          throw new BadRequestException('Reservation not found');
        }
      
        // Verifica se a reserva está com status OPEN
        if (reservation.status !== 'OPEN') {
          throw new BadRequestException('Only reservations with status OPEN can be viewed');
        }
      
        // Verifica se o cliente está ativo
        if (!reservation.client || reservation.client.status !== 'ACTIVE') {
          throw new BadRequestException('Client is inactive or does not exist');
        }
      
        // Verifica se o espaço está ativo
        if (!reservation.space || reservation.space.status !== 'ACTIVE') {
          throw new BadRequestException('Space is inactive or does not exist');
        }
      
        // Verifica se todos os recursos estão ativos
        for (const res of reservation.resources) {
          if (!res.resource || res.resource.status !== 'ACTIVE') {
            throw new BadRequestException(`Resource ID ${res.resource_id} is inactive or does not exist`);
          }
        }
      
        return reservation;
      }
      
      async cancel(id: number) {
        // Busca a reserva no banco de dados
        const reservation = await this.prisma.reservation.findUnique({
          where: { id },
        });
    
        // Verifica se a reserva existe
        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }
    
        // Verifica se a reserva está com status OPEN
        if (reservation.status !== 'OPEN') {
          throw new BadRequestException('Only reservations with status OPEN can be cancelled');
        }
    
        // Atualiza o status da reserva para CANCELLED e registra a data da alteração
        const updatedReservation = await this.prisma.reservation.update({
          where: { id },
          data: {
            status: 'CANCELLED', // Altera o status para cancelado
            updated_at: new Date(), // Salva a data de alteração
          },
        });
    
        return updatedReservation; // Retorna a reserva atualizada
      }
    }


  
