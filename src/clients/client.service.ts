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
      const existingEmail = await this.prisma.client.findUnique({
        where: { email: dto.email },
      });
  
      const existingCpf = await this.prisma.client.findUnique({
        where: { cpf: dto.cpf },
      });
  
      if (existingEmail && existingCpf) {
        throw new BadRequestException('Both email and CPF are already registered');
      }
      
      if (existingEmail) {
        throw new BadRequestException('This email is already registered');
      }
      
      if (existingCpf) {
        throw new BadRequestException('This CPF is already registered');
      }
  
      const birthDate = new Date(dto.birth_date);
      if (isNaN(birthDate.getTime())) {
        throw new BadRequestException('Invalid birth date format');
      }
  
      const newClient = await this.prisma.client.create({
        data: {
          ...dto,
          birth_date: birthDate,
          status: StatusEnum.ACTIVE,
        },
      });
  
      return newClient;
    } catch (error: any) {
      
      if (error instanceof BadRequestException) {
        throw error; 
      }
      
      throw new InternalServerErrorException(
        'An error occurred while creating the client. Please try again later.',
      );
    }
  }
  
  async update(id: number, dto: UpdateClientDto): Promise<any> {
    try {
      const data: any = {
        ...dto,
        updated_at: new Date(),
      };
  
      if (dto.birth_date) {
        const birthDate = new Date(dto.birth_date);
        if (isNaN(birthDate.getTime())) {
          throw new BadRequestException('Invalid birth date format');
        }
        data.birth_date = birthDate;
      }
  
      const updatedClient = await this.prisma.client.update({
        where: { id },
        data,
      });
  
      return updatedClient;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Client not found');
      }
  
      throw new InternalServerErrorException(
        `Error updating client: ${error.message}`,
        error.stack,
      );
    }
  }
  

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      email?: string;
      name?: string;
      cpf?: string;
      status?: StatusEnum;
    },
  ): Promise<any> {
    const where: any = {};
  
    if (filters?.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }
  
    if (filters?.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }
  
    if (filters?.cpf) {
      where.cpf = { contains: filters.cpf };
    }
  
    if (filters?.status !== undefined) {
      where.status = filters.status;
    }
  
    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);
  
    return {
      data: clients,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }
  
  async findById(id: number): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
  
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  
    return client;
  }

  async deactivate(id: number): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: {
              in: ['OPEN', 'APPROVED'],
            },
          },
        },
      },
    });
  
    if (client!.reservations.length > 0) {
      throw new BadRequestException(
        'Cannot deactivate a client with open or approved reservations',
      );
    }
  
    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: {
        status: StatusEnum.INACTIVE,
        updated_at: new Date(),
      },
    });
  
    return updatedClient;
  }
  
  
  
}



