import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpacesModule } from './spaces/spaces.module';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, SpacesModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
