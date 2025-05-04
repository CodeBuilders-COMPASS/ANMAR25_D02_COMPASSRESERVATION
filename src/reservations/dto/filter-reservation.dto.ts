import { IsInt, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterReservationDto {

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  client_id?: number; 

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  space_id?: number; 

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_date?: Date; 

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_date?: Date; 

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
