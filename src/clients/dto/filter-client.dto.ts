import { IsOptional, IsString, IsEnum } from 'class-validator';
import { StatusEnum } from '../../enums/status.enum';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FilterClientDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}