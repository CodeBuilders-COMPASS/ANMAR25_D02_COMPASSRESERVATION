import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, NotContains, Length, IsInt, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SpaceResource {
    @ApiProperty({ example: 1, description: 'ID of the resource to associate with the space' })
    @IsInt()
    resource_id: number;
}

export class CreateSpaceDto {
    @ApiProperty({ example: 'Meeting Room A', description: 'Name of the space', minLength: 3, maxLength: 56 })
    @IsNotEmpty()
    @Length(3, 56)
    name: string;

    @ApiProperty({ example: 'A large meeting room with projector', description: 'Description of the space' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 10, description: 'Capacity of the space' })
    @IsNotEmpty()
    @IsNumber()
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