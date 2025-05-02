import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { StatusEnum } from 'src/enums/status.enum';



export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  client_id?: number; 

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  space_id?: number; 

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string; 

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string; 
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  resources?: Array<{
    resource_id: number; 
    quantity: number;  
  }>;

  @IsOptional()
  @IsNotEmpty()
  status?: StatusEnum;
}
