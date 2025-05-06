import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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

    const { name, description, capacity, resources } = createSpaceDto;

    return this.prisma.space.create({
      data: {
        name,
        description,
        capacity,
        updated_at: null, 
        status: StatusEnum.ACTIVE,
        spaceResources: {
          create: resources.map((r) => ({
            resource_id: r.resource_id,
          })),
        },
      },
    });
  }

  async findAll(filterDto: FilterSpaceDto) {
    const { name, capacity, status, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const where = {
      name: name ? { contains: name } : undefined,
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
        include: {
          spaceResources: {
            include: {
              resource: true,
            },
          },
        },
      }),
    ]);

    return {
      count,
      pages: Math.ceil(count / limit),
      data,
    };
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: {
        spaceResources: {
          include: {
            resource: true,
          },
        },
      },
    });

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

    if (updateDto.resources && updateDto.resources.length > 0) {
      await this.prisma.spaceResource.deleteMany({
        where: { space_id: id },
      });

      await this.prisma.spaceResource.createMany({
        data: updateDto.resources.map((r) => ({
          space_id: id,
          resource_id: r.resource_id,
        })),
      });
    }

    return this.prisma.space.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        capacity: updateDto.capacity,
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
