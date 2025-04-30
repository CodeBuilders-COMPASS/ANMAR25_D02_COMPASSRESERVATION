import { Body, Controller, Get, Param, Post, Delete, Query, ParseIntPipe, Patch, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Endpoint para criar uma nova reserva
  @Post()
  async create(@Body(new ValidationPipe()) dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  // Endpoint para editar uma reserva existente
  @Patch(':id')
  async update(@Param('id', ParseIntPipe, new PositiveIntPipe()) id: number, @Body(new ValidationPipe()) dto: UpdateReservationDto) {
    return this.reservationService.update(id, dto);
  }

  // Endpoint para listar as reservas com paginação e filtros opcionais
  @Get()
  async findAll(@Query('page', new PositiveIntPipe()) page = 1) {
    return this.reservationService.findAll(page);
  }
  

  // Endpoint para buscar uma reserva por ID (com regras de negócio aplicadas)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe, new PositiveIntPipe()) id: number) {
    return this.reservationService.findOne(id);
  }

  // Endpoint para cancelar uma reserva
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe, new PositiveIntPipe()) id: number) {
    return this.reservationService.cancel(id);
  }
}
