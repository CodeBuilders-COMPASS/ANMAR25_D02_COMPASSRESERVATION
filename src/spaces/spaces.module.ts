import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IdCheckMiddleware } from '../middlewares/id-check.middleware';


@Module({
  imports: [PrismaModule],
  providers: [SpacesService],
  controllers: [SpacesController]
})
export class SpacesModule {}
