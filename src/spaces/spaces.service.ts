import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { FilterSpaceDto } from './dto/filter-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const exists = await this.prisma.space.findUnique({
      where: { name: createSpaceDto.name },
    });

    if (exists) {
      throw new BadRequestException('Space with this name already exists.');
    }

    return this.prisma.space.create({
      data: {
        ...createSpaceDto,
        status: StatusEnum.ACTIVE
      },
    });
  }

  async findAll(filterDto: FilterSpaceDto) {
    const {
      name,
      capacity,
      status,
      page = 1,
      limit = 10,
    } = filterDto;

    const skip = (page - 1) * limit;

    const where = {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      capacity: capacity ? { gte: capacity } : undefined,
      status: status ?? undefined,
    };

    const [count, data] = await Promise.all([
      this.prisma.space.count({ where }),
      this.prisma.space.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      count,
      pages: Math.ceil(count / limit),
      data,
    };
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found.`);
    }
    return space;
  }

  async update(id: number, updateDto: UpdateSpaceDto) {
    const existing = await this.findOne(id);

    if (updateDto.name && updateDto.name !== existing.name) {
      const nameExists = await this.prisma.space.findUnique({
        where: { name: updateDto.name },
      });
      if (nameExists && nameExists.id !== id) {
        throw new BadRequestException('Space with this name already exists.');
      }
    }

    return this.prisma.space.update({
      where: { id },
      data: {
        ...updateDto,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.space.update({
      where: { id },
      data: {
        status: StatusEnum.INACTIVE, 
        updated_at: new Date(),
      },
    });
  }
}
