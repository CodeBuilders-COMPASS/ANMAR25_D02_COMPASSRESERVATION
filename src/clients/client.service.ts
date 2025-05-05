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
  

  async update(id: number, dto: UpdateClientDto) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async findAll({ email, name, cpf, status, page, limit }) {
    const where = {
      ...(email && { email: { contains: email } }),
      ...(name && { name: { contains: name } }),
      ...(cpf && { cpf: { contains: cpf } }),
      ...(status && { status }),
    };

    return this.prisma.client.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
    });
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async inactivate(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: { in: [ReservationStatus.OPEN, ReservationStatus.APPROVED] },
          },
        },
      },
    });

    if (!client) throw new NotFoundException('Client not found');

    if (client.reservations.length > 0) {
      throw new BadRequestException('Client has open or approved reservations');
    }

    return this.prisma.client.update({
      where: { id },
      data: {
        status: StatusEnum.INACTIVE,
      },
    });
  }
}
