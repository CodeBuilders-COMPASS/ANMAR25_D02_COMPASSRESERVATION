// src/reservations/dto/create-reservation.dto.ts
import { IsDateString, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResourceItem {
  @IsInt()
  resource_id: number;

  @IsInt()
  quantity: number;
}

export class CreateReservationDto {
  @IsInt()
  user_id: number;

  @IsInt()
  client_id: number;

  @IsInt()
  space_id: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceItem)
  resources: ResourceItem[];
}
