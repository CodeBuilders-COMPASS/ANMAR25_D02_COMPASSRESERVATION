import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpaceExistsPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
    });
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return id;
  }
}