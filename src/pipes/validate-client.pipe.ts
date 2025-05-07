import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ClientValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    if (!value.client_id) {
      throw new BadRequestException('client_id is required');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: value.client_id },
    });

    if (!client || client.status !== StatusEnum.ACTIVE) {
      throw new BadRequestException('Inactive or nonexistent client');
    }

    return value;
  }
}
