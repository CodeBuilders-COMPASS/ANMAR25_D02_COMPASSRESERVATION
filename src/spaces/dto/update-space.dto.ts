import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSpaceDto {
    @ApiPropertyOptional({ example: 'Updated Meeting Room', description: 'Updated name of the space' })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Name must not be empty' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated description of the space' })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Description must not be empty' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    description?: string;

    @ApiPropertyOptional({ example: 15, description: 'Updated capacity of the space' })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;
}
