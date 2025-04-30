import { Module } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { ReservationController } from './reservations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ReservationService, PrismaService],
  controllers: [ReservationController],
})
export class ReservationModule {}
