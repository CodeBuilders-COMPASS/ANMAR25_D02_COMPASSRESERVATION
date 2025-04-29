import { IsNotEmpty, IsNumber, IsString, NotContains, Length } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  @NotContains(" ")
  @Length(3, 56)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}