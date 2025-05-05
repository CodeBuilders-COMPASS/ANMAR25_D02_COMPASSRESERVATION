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
import { StatusEnum } from 'src/enums/status.enum';


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

    @Get()
    async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('cpf') cpf?: string,
    @Query('status') status?: StatusEnum,
    ) {
    return this.clientService.findAll(
        Number(page) || 1,
        Number(limit) || 10,
        {
        email,
        name,
        cpf,
        status,
        },
    );
    }

    @Get(':id')
    async findOne(@Param('id', PositiveIntPipe) id: number) {
    return this.clientService.findById(id);
    }

    
}

 

