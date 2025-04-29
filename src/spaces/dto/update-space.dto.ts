import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateSpaceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
