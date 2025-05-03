import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IdCheckMiddleware } from '../middlewares/id-check.middleware';
import path from 'path';

@Module({
  imports: [PrismaModule],
  providers: [SpacesService],
  controllers: [SpacesController],
})
export class SpacesModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdCheckMiddleware).forRoutes({
      path: 'spaces/:id',
      method: RequestMethod.ALL
    })
  }
}
