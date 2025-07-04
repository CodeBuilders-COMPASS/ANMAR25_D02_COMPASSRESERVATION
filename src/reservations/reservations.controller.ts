import { Body, Controller, Get, Param, Post, Delete, Query, Patch, UsePipes, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { ClientValidationPipe } from 'src/pipes/validate-client.pipe';
import { SpaceValidationPipe } from 'src/pipes/validate-space.pipe';
import { ResourceValidationPipe } from 'src/pipes/validate-resources.pipe';
import { ReservationConflictPipe } from 'src/pipes/check-reservation-conflict.pipe';
import { ReservationExistsPipe } from 'src/pipes/reservation-exists.pipe';
import { FilterReservationDto } from './dto/filter-reservation.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reservations')
@ApiBearerAuth('JWT-auth') 
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  
  @Post()
  @UsePipes(
    ClientValidationPipe,
    SpaceValidationPipe,
    ResourceValidationPipe,
    ReservationConflictPipe
  )
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }
  @Get()
  async findAll(@Query() filterDto: FilterReservationDto) {
    return this.reservationService.findAll(filterDto);
  }
  @Get(':id')
  async findOne(
    @Param('id', PositiveIntPipe, ReservationExistsPipe) id: number
  ) {
    return this.reservationService.findOne(id);
  }
  @Patch(':id')
  @UsePipes(
    ClientValidationPipe,
    SpaceValidationPipe,
    ResourceValidationPipe
  )

  async update(
    @Param('id', PositiveIntPipe, ReservationExistsPipe) id: number, 
    @Body() updateReservationDto: UpdateReservationDto){
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id/cancel')
  async cancel(
    @Param('id', PositiveIntPipe, ReservationExistsPipe)  id: number
  ) {
    return this.reservationService.cancel(id);
  }
}


