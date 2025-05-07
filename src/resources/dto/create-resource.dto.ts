import { IsNotEmpty, IsNumber, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ example: 'Resource Name', description: 'The name of the resource', minLength: 3, maxLength: 56 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({ example: 'Resource description', description: 'The description of the resource', required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10, description: 'The quantity of the resource' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}