import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class ResourceItem {
  @ApiProperty({ example: 1, description: 'ID of the resource' })
  @IsInt()
  resource_id: number;

  @ApiProperty({ example: 2, description: 'Quantity of the resource needed' })
  @IsInt()
  quantity: number;
}

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'ID of the user creating the reservation' })
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 1, description: 'ID of the client making the reservation' })
  @IsNotEmpty()
  @IsInt()
  client_id: number;

  @ApiProperty({ example: 1, description: 'ID of the space being reserved' })
  @IsNotEmpty()
  @IsInt()
  space_id: number;

  @ApiProperty({ example: '2023-12-01T10:00:00Z', description: 'Start date and time of reservation' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2023-12-01T12:00:00Z', description: 'End date and time of reservation' })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiProperty({ type: [ResourceItem], description: 'List of resources needed for the reservation' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceItem)
  resources: ResourceItem[];
}