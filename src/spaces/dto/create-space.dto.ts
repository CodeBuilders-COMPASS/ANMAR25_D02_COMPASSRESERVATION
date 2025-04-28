import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}