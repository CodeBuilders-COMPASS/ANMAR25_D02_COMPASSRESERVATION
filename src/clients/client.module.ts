import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CpfValidationPipe } from '../pipes/cpf-validation.pipe';
import { EmailValidationPipe } from '../pipes/email-validation.pipe';
import { BirthDateValidationPipe } from '../pipes/birth-date-validation.pipe';
import { PhoneValidationPipe } from '../pipes/phone-validation.pipe';

@Module({
  controllers: [ClientController],
  providers: [
    ClientService,
    PrismaService,
    CpfValidationPipe,
    EmailValidationPipe,
    BirthDateValidationPipe,
    PhoneValidationPipe,
  ],
})
export class ClientModule {}
