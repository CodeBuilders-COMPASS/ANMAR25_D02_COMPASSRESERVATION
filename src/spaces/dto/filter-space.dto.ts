import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEnum } from '../../enums/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class FilterSpaceDto {
    @ApiPropertyOptional({ example: 'Meeting Room', description: 'Filter by space name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 5, description: 'Filter by minimum capacity' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    capacity?: number;

    @ApiPropertyOptional({ enum: StatusEnum, example: StatusEnum.ACTIVE, description: 'Filter by status' })
    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum;

    @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number;

    @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?: number;
}