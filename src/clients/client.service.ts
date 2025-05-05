import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {  ReservationStatus } from '../enums/reservationStatus.enum';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto): Promise<any> {
    try {
      const newClient = await this.prisma.client.create({
        data: {
          ...dto,
          status: StatusEnum.ACTIVE, 
        },
      });
      return newClient;
    } catch (error: any) {
      
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or CPF already registered');
      }
      throw new InternalServerErrorException(
        'Error creating client: ' + error.message,
      );
    }
  }
  
  async update(id: number, dto: UpdateClientDto): Promise<any> {
    try {
      const updatedClient = await this.prisma.client.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.cpf && { cpf: dto.cpf }),
          ...(dto.birth_date && { birth_date: dto.birth_date }),
          ...(dto.email && { email: dto.email }),
          ...(dto.phone && { phone: dto.phone }),
          updated_at: new Date(),
        },
      });
      return updatedClient;
    } catch (error) {
      throw new BadRequestException(`Error updating client: ${error.message}`);
    }
  }

  
}



