// src/reservations/dto/create-reservation.dto.ts
import { IsDateString, IsInt, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class ResourceItem {
  @IsInt()
  resource_id: number;

  @IsInt()
  quantity: number;
}

export class CreateReservationDto {

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  client_id: number;

  @IsNotEmpty()
  @IsInt()
  space_id: number;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceItem)
  resources: ResourceItem[];
}
