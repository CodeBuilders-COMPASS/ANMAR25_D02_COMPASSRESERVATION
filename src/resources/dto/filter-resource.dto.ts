import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsEnum, IsDate, IsString, Matches } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterReservationDto {
  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF of the client to filter reservations',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    { message: 'CPF must be in the format XXX.XXX.XXX-XX' },
  )
  cpf?: string;

  @ApiProperty({
    enum: ReservationStatus,
    description: 'Status to filter reservations',
    required: false
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}