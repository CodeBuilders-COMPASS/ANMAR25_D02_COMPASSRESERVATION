import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpacesModule } from './spaces/spaces.module';
import { PrismaService } from './prisma/prisma.service';
import { ResourceModule } from './resources/resources.module';
import { ReservationModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './clients/client.module';
import { HandlerException } from './common/exception/handler-exception';
import { IdCheckMiddleware } from './middlewares/id-check.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule,
    SpacesModule, ResourceModule, ReservationModule, ClientModule],
  controllers: [AppController],
  providers: [   
    {
      provide: APP_FILTER,
      useClass: HandlerException,
    },
    AppService, PrismaService],
  exports: [AppService],
})
export class AppModule {}

