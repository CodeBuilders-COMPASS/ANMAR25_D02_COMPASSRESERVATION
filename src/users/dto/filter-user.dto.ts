import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { StatusEnum } from "../../enums/status.enum";
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";


export class FilterUserDto {
  @ApiPropertyOptional({ 
    example: 'John', 
    description: 'Filter by user name' 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    example: 'john@example.com', 
    description: 'Filter by user email' 
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ 
    enum: StatusEnum, 
    example: StatusEnum.ACTIVE, 
    description: 'Filter by user status' 
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Page number', 
    default: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ 
    example: 10, 
    description: 'Items per page', 
    default: 10 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}