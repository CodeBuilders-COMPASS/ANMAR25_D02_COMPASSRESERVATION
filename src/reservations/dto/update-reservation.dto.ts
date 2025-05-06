import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto {
  
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string; 

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string; 

  @IsOptional()
  @IsNotEmpty()
  status?: ReservationStatus;
}
