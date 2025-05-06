import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEnum } from 'src/enums/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterResourceDto {
  @ApiPropertyOptional({ example: 'Resource', description: 'Filter by resource name' })
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiPropertyOptional({ enum: StatusEnum, example: StatusEnum.ACTIVE, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}