import {
  IsEmail,
  IsMobilePhone,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
  })
  password: string;

  @IsMobilePhone("pt-BR")
  telephone: string;
}
