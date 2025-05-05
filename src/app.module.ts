import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpacesModule } from './spaces/spaces.module';
import { PrismaService } from './prisma/prisma.service';
import { IdCheckMiddleware } from './middlewares/id-check.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SpacesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IdCheckMiddleware)
      .forRoutes(
        'spaces/:id',
        'resources/:id',
        'reservations/:id',
      );
  }
}
