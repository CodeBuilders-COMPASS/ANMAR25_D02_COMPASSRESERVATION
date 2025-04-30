import { Body, Controller, Get, Param, Post, Delete, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Endpoint para criar uma nova reserva
  @Post()
  async create(@Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  // Endpoint para editar uma reserva existente
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateReservationDto) {
    return this.reservationService.update(id, dto);
  }

  // Endpoint para listar as reservas com paginação e filtros opcionais
  @Get()
  async findAll(
    @Query('page') page: number = 1
  ) {
    return this.reservationService.findAll(page);  // Passando apenas a paginação para o serviço
  }


  // Endpoint para buscar uma reserva por ID (com regras de negócio aplicadas)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  // Endpoint para cancelar uma reserva
  @Patch(':id/cancel') // Alterado para PATCH e caminho "/cancel"
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.cancel(id); // Chama o método de cancelamento
  }
}
