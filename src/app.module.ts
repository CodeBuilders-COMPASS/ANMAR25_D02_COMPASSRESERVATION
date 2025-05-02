import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { IdCheckMiddleware } from './middlewares/id-check.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpacesModule } from './spaces/spaces.module';
import { PrismaService } from './prisma/prisma.service';
import { ResourceModule } from './resources/resources.module';
import { ReservationModule } from './reservations/reservations.module';

@Module({
  imports: [SpacesModule, ResourceModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdCheckMiddleware)
      .forRoutes('spaces/:id', 'resources/:id', 'reservations/:id');
  }
}
