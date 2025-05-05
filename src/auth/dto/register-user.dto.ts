import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
