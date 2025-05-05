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



