import { IsNotEmpty, IsNumber, IsString, Length, IsOptional } from 'class-validator';

export class CreateResourceDto {

  @IsString()
  @IsNotEmpty()
  @Length(3, 56)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}