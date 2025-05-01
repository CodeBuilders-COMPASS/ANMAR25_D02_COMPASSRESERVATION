import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ResourceService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createResourceDto: CreateResourceDto) {
        const exists = await this.prisma.resource.findUnique({
            where: { name: createResourceDto.name },
        });

        if (exists) {
            throw new BadRequestException('Resource with this name already exists.');
        }

        return this.prisma.resource.create({
            data: {
                ...createResourceDto,
                status: StatusEnum.ACTIVE
            },
        });
    }
    async findAll(filterDto: FilterResourceDto) {
        const {
            name,
            quantity,
            status,
            page = 1,
            limit = 10,
        } = filterDto;

        const skip = (page - 1) * limit;

        const where = {
            name: name ? { contains: name } : undefined,
            quantity: quantity ? { gte: quantity } : undefined,
            status: status ?? undefined,
        };

        const [count, data] = await Promise.all([
            this.prisma.resource.count({ where }),
            this.prisma.resource.findMany({
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
        const resource = await this.prisma.resource.findUnique({ where: { id } });
        if (!resource) {
            throw new NotFoundException(`Resource with ID ${id} not found.`);
        }
        return resource;
    }

    async update(id: number, updateDto: UpdateResourceDto) {
        const existing = await this.findOne(id);

        if (updateDto.name && updateDto.name !== existing.name) {
            const nameExists = await this.prisma.resource.findUnique({
                where: { name: updateDto.name },
            });
            if (nameExists && nameExists.id !== id) {
                throw new BadRequestException('Resource with this name already exists.');
            }
        }

        return this.prisma.resource.update({
            where: { id },
            data: {
                ...updateDto,
                updated_at: new Date(),
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.resource.update({
            where: { id },
            data: {
                status: StatusEnum.INACTIVE,
                updated_at: new Date(),
            },
        });
    }
} 