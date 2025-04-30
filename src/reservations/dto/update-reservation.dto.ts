import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { StatusEnum } from 'src/enums/status.enum';



export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  client_id?: number; // ID do cliente (caso queira atualizar)

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  space_id?: number; // ID do espaço reservado (caso queira atualizar)

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string; // Nova data de início

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string; // Nova data de término

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  resources?: Array<{
    resource_id: number; // ID do recurso
    quantity: number;  // Quantidade de recursos solicitados
  }>;

  @IsOptional()
  @IsNotEmpty()
  status?: StatusEnum;
}
