import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusEnum } from '../enums/status.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const emailExists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (emailExists) throw new BadRequestException('Email already exists.');

    const password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        updated_at: null, 
        password,
        status: StatusEnum.ACTIVE,
      },
    });
  }

  async findAll(query) {
    const { name, email, status, page = 1, limit = 10 } = query;
    const where: any = {};

    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (status === StatusEnum.ACTIVE || status === StatusEnum.INACTIVE) {
      where.status = status;
    }

    return this.prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');

    const updateData: any = { ...data, updated_at: new Date() };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');

    return this.prisma.user.update({
      where: { id },
      data: {
        status: StatusEnum.INACTIVE,
        updated_at: new Date(),
      },
    });
  }
}
