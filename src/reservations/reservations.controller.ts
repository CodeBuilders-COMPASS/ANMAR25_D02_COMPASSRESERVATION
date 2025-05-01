import { Body, Controller, Get, Param, Post, Delete, Query, ParseIntPipe, Patch, ValidationPipe, BadRequestException, UsePipes } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { ClientValidationPipe } from 'src/pipes/validate-client.pipe';
import { SpaceValidationPipe } from 'src/pipes/validate-space.pipe';
import { ResourceValidationPipe } from 'src/pipes/validate-resources.pipe';
import { ReservationConflictPipe } from 'src/pipes/check-reservation-conflict.pipe';
import { ReservationExistsPipe } from 'src/pipes/reservation-exists.pipe';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  
  @Post()
  @UsePipes(
    ClientValidationPipe,
    SpaceValidationPipe,
    ResourceValidationPipe,
    ReservationConflictPipe
  )
  async create(@Body() data: CreateReservationDto) {
    return this.reservationService.create(data);
  }


  
  @Patch(':id')
  @UsePipes(
    ClientValidationPipe,
    SpaceValidationPipe,
    ResourceValidationPipe
  )
  async update(@Param('id') id: number, @Body() dto: UpdateReservationDto) {
    return this.reservationService.update(id, dto);
  }

  
  @Get()
  async findAll(@Query('page', new PositiveIntPipe()) page = 1) {
    return this.reservationService.findAll(page);
  }
  

  
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe, PositiveIntPipe, ReservationExistsPipe) reservation
  ) {
    return this.reservationService.findOne(reservation);
  }


  
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe, new PositiveIntPipe()) id: number) {
    return this.reservationService.cancel(id);
  }
}
