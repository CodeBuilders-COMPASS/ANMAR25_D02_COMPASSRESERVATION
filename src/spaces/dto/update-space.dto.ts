import { IsOptional, IsString, IsInt, Min, IsArray, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSpaceDto {
    @ApiPropertyOptional({ example: 'Updated Meeting Room', description: 'Updated name of the space' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated description of the space' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 15, description: 'Updated capacity of the space' })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;
}