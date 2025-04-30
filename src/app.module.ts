import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpacesModule } from './spaces/spaces.module';
import { PrismaService } from './prisma/prisma.service';
import { ResourceModule } from './resources/resources.module';

@Module({
  imports: [SpacesModule, ResourceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [AppService]
})
export class AppModule {}
