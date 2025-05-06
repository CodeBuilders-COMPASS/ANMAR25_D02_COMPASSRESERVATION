import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

class UpdateResourceItem {
  @ApiProperty({ example: 1, description: 'ID of the resource' })
  @IsInt()
  resource_id: number;

  @ApiProperty({ example: 2, description: 'Quantity of the resource needed' })
  @IsInt()
  quantity: number;
}

export class UpdateReservationDto {
  @ApiProperty({ example: 1, description: 'ID of the client making the reservation', required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  client_id?: number;

  @ApiProperty({ example: 2, description: 'ID of the space being reserved', required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  space_id?: number;

  @ApiProperty({ example: '2023-12-01T11:00:00Z', description: 'Start date and time of reservation', required: false })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string;

  @ApiProperty({ example: '2023-12-01T13:00:00Z', description: 'End date and time of reservation', required: false })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string;

  @ApiProperty({ type: [UpdateResourceItem], description: 'List of resources needed for the reservation', required: false })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  resources?: UpdateResourceItem[];

  @ApiProperty({ enum: ReservationStatus, description: 'Status of the reservation', required: false })
  @IsOptional()
  @IsNotEmpty()
  status?: ReservationStatus;
}