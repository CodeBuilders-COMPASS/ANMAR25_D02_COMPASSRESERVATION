import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ResourcesValidationExistPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    for (const res of value.resources) {
      const resource = await this.prisma.resource.findUnique({
        where: { id: res.resource_id },
      });

      if (!resource || resource.status !== StatusEnum.ACTIVE) {
        throw new BadRequestException(`Inactive or nonexistent resource ID ${res.resource_id}`);
      }
    }

    return value;
  }
}
