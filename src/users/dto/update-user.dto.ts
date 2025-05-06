import { IsOptional, IsEmail, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    example: 'Updated Name', 
    description: 'Updated user name' 
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    example: 'updated@example.com', 
    description: 'Updated user email' 
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ 
    example: 'NewPassword123', 
    description: 'Updated user password (min 8 chars with letters and numbers)',
    minLength: 8
  })
  @IsOptional()
  @Length(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'Password must contain letters and numbers',
  })
  password?: string;

  @ApiPropertyOptional({ 
    example: '11987654321', 
    description: 'Updated user phone number' 
  })
  @IsOptional()
  @Matches(/^\d{10,15}$/, { message: 'Invalid phone number' })
  phone?: string;
}