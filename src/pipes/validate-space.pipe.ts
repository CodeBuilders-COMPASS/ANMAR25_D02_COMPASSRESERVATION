import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusEnum } from 'src/enums/status.enum';

@Injectable()
export class SpaceValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    const space = await this.prisma.space.findUnique({
      where: { id: value.space_id },
    });

    if (!space || space.status !== StatusEnum.ACTIVE) {
      throw new BadRequestException('Inactive or nonexistent space');
    }

    return value;
  }
}
