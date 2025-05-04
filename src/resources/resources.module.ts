import { Module } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ResourceController } from './resources.controller';

@Module({
  imports: [PrismaModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}


