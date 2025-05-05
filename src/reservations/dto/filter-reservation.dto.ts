import { IsInt, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterReservationDto {

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
