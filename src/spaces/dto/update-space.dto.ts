import { IsOptional, IsString, IsInt, Min, IsArray, IsNotEmpty } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  resources?: Array<{
    resource_id: number;
  }>;

}
