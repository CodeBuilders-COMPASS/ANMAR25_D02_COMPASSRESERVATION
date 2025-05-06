import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { StatusEnum } from '../enums/status.enum';
import { FilterClientDto } from './dto/filter-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
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

      return await this.prisma.client.create({
        data: {
          ...dto,
          birth_date: birthDate,
          updated_at: null, 
          status: StatusEnum.ACTIVE,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while creating the client');
    }
  }

  async update(id: number, dto: UpdateClientDto) {
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

      return await this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Client not found');
      }
      throw new InternalServerErrorException('Error updating client');
    }
  }

  async findAll(filters: FilterClientDto) {
    const { page = 1, limit = 10, ...restFilters } = filters;
    const where = this.buildWhereClause(restFilters);

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

  private buildWhereClause(filters: Omit<FilterClientDto, 'page' | 'limit'>) {
    const where: any = {};

    if (filters.email) {
      where.email = { contains: filters.email };
    }

    if (filters.name) {
      where.name = { contains: filters.name };
    }

    if (filters.cpf) {
      where.cpf = { contains: filters.cpf };
    }

    if (filters.status !== undefined) {
      where.status = filters.status;
    }

    return where;
  }

  async findById(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async deactivate(id: number) {
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

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.reservations.length > 0) {
      throw new BadRequestException(
        'Cannot deactivate a client with open or approved reservations',
      );
    }

    return await this.prisma.client.update({
      where: { id },
      data: {
        status: StatusEnum.INACTIVE,
        updated_at: new Date(),
      },
    });
  }
}
