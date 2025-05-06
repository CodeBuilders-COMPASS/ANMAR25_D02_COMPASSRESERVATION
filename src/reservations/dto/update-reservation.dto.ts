import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string;

  @ApiProperty({ example: '2023-12-01T13:00:00Z', description: 'End date and time of reservation', required: false })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string;

  @IsOptional()
  @IsNotEmpty()
  status?: ReservationStatus;
}