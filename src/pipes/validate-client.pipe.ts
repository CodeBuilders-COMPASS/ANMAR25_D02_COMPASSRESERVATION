import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    const client = await this.prisma.client.findUnique({
      where: { id: value.client_id },
    });

    if (!client || client.status !== 'ACTIVE') {
      throw new BadRequestException('Inactive or nonexistent client');
    }

    return value;
  }
}
