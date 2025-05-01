import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReservationDto) {
    const { client_id, space_id, start_date, end_date, resources } = data;
  
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
