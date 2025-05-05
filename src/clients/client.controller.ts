import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientValidationPipe } from '../pipes/validate-client.pipe';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { EmailValidationPipe } from 'src/pipes/email-validation.pipe';
import { CpfValidationPipe } from 'src/pipes/cpf-validation.pipe';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body(ClientValidationPipe, EmailValidationPipe, CpfValidationPipe) dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  
}

 

