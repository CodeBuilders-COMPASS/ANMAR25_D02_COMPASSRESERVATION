import { IsOptional, IsString, IsEnum } from 'class-validator';
import { StatusEnum } from '../../enums/status.enum';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterClientDto {
  @ApiProperty({
    description: 'Page number',
    required: false,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    required: false,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by email (contains)',
    required: false,
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Filter by name (contains)',
    required: false,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter by CPF (contains)',
    required: false,
    example: '123.456.789',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({
    description: 'Filter by status',
    required: false,
    enum: StatusEnum,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}