import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, NotContains, Length, IsInt, IsArray, ValidateNested } from 'class-validator';

class SpaceResource {
  @IsInt()
  resource_id: number;
}
export class CreateSpaceDto {

  @IsNotEmpty()
  @Length(3, 56)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpaceResource)
  resources: SpaceResource[];
}