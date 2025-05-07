import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
    IsOptional,
    IsString,
    IsInt,
    Min,
    IsArray,
    ValidateNested,
    MinLength,
} from 'class-validator';

class SpaceResource {
    @ApiPropertyOptional({ example: 1, description: 'ID of the resource to associate with the space' })
    @IsInt()
    resource_id: number;
}

export class UpdateSpaceDto {
    @ApiPropertyOptional({ example: 'Updated Meeting Room', description: 'Updated name of the space' })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Name must not be empty after trimming' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated description of the space' })
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Description must not be empty after trimming' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    description?: string;

    @ApiPropertyOptional({ example: 15, description: 'Updated capacity of the space' })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @ApiPropertyOptional({
        type: [SpaceResource],
        example: [{ resource_id: 1 }, { resource_id: 2 }],
        description: 'Updated list of resources associated with the space'
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpaceResource)
    resources?: SpaceResource[];
}
