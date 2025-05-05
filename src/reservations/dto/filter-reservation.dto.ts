import { IsInt, IsOptional, IsEnum, IsDate, IsString, Matches } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterReservationDto {

  @IsOptional()
  @IsString()
    @Matches(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      { message: 'CPF must be in the format XXX.XXX.XXX-XX' },
    )
    cpf?: string;

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
