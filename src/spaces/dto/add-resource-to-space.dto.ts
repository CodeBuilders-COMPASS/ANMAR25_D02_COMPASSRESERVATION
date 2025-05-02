import { IsInt, IsNotEmpty } from "class-validator";

export class AddResourceToSpaceDto {
    @IsNotEmpty()
    @IsInt()
    resource_id: number
}