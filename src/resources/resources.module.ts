import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ResourceController } from './resources.controller';
import { IdCheckMiddleware } from 'src/middlewares/id-check.middleware';


@Module({
  imports: [PrismaModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdCheckMiddleware).forRoutes({
      path: 'resources/:id',
      method: RequestMethod.ALL
    })
  }
}


