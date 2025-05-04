import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return id;
  }
}