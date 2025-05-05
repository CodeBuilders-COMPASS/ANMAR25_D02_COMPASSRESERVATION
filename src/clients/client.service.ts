import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {  ReservationStatus } from '../enums/reservationStatus.enum';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    
    const existingEmail = await this.prisma.client.findFirst({
      where: {
        email: dto.email,
        status: StatusEnum.ACTIVE,
      },
    });
  
    const existingCpf = await this.prisma.client.findFirst({
      where: {
        cpf: dto.cpf,
        status: StatusEnum.ACTIVE,
      },
    });
    
    if (existingEmail) {
      throw new BadRequestException(`Email '${dto.email}' is already in use by an active client.`);
    }
  
    if (existingCpf) {
      throw new BadRequestException(`CPF '${dto.cpf}' is already in use by an active client.`);
    }
  
    return this.prisma.client.create({
      data: {
        ...dto,
        status: StatusEnum.ACTIVE,
      },
    });
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
          updatedAt: new Date(),
        },
      });
      return updatedClient;
    } catch (error) {
      throw new BadRequestException(`Error updating client: ${error.message}`);
    }
  }

  
}



