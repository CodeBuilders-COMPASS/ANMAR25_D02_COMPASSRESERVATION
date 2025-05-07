import { Type, Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    Length,
    IsInt,
    IsArray,
    ValidateNested,
    MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SpaceResource {
    @ApiProperty({ example: 1, description: 'ID of the resource to associate with the space' })
    @IsInt()
    resource_id: number;
}

export class CreateSpaceDto {
    @ApiProperty({ example: 'Meeting Room A', description: 'Name of the space', minLength: 3, maxLength: 50 })
    @IsNotEmpty()
    @IsString()
    @MinLength(1, { message: 'Name must not be empty after trimming' })
    @Length(3, 50)
    @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    name: string;

    @ApiProperty({ example: 'A large meeting room with projector', description: 'Description of the space' })
    @IsNotEmpty()
    @IsString()
    @MinLength(1, { message: 'Description must not be empty after trimming' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    description: string;

    @ApiProperty({ example: 10, description: 'Capacity of the space' })
    @IsNotEmpty()
    @IsInt()
    capacity: number;

    @ApiProperty({
        type: [SpaceResource],
        example: [{ resource_id: 1 }, { resource_id: 2 }],
        description: 'List of resources associated with the space'
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpaceResource)
    resources: SpaceResource[];
}
