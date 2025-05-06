import { IsEmail, IsMobilePhone, IsString, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ 
    example: 'John Doe', 
    description: 'User full name' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'john.doe@example.com', 
    description: 'User email address' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'StrongPassword123', 
    description: 'User password (min 8 chars with letters and numbers)',
    minLength: 8
  })
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;

  @ApiProperty({ 
    example: '11987654321', 
    description: 'User phone number (Brazilian format)' 
  })
  @IsMobilePhone("pt-BR")
  phone: string;
}