import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusEnum } from '../enums/status.enum'; 

@Injectable()
export class ClientExistsPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(id: number): Promise<number> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    if (client.status !== StatusEnum.ACTIVE) {
      throw new BadRequestException(`Client with ID ${id} is inactive`); 
    }

    return id;
  }
}
