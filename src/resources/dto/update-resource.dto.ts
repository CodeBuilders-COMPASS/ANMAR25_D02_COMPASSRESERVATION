import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateResourceDto {
  @ApiPropertyOptional({ example: 'Updated Resource Name', description: 'The new name of the resource' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description', description: 'The new description of the resource' })
  @IsOptional()
  @IsString()
  description?: string;
}