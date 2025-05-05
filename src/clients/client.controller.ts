import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientValidationPipe } from '../pipes/validate-client.pipe';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { ClientExistsPipe } from 'src/pipes/client-exist.pipe';


@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body()
    dto: CreateClientDto,
  ) {
    return this.clientService.create(dto);
  }

    @Patch(':id')
    @UsePipes(
    new ValidationPipe({ transform: true }),
    )
    async update(
    @Param('id', PositiveIntPipe, ClientExistsPipe) id: number,
    @Body() dto: UpdateClientDto,
    ) {
    return this.clientService.update(id, dto);
    }

}

 

