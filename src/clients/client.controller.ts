import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientValidationPipe } from '../pipes/validate-client.pipe';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { EmailValidationPipe } from 'src/pipes/email-validation.pipe';
import { CpfValidationPipe } from 'src/pipes/cpf-validation.pipe';
import { ClientExistsPipe } from 'src/pipes/client-exist.pipe';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body( ClientExistsPipe, EmailValidationPipe, CpfValidationPipe) dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  @Patch(':id')
  @UsePipes(PositiveIntPipe, ClientExistsPipe, EmailValidationPipe, CpfValidationPipe)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientService.update(id, dto);
  }

}

 

