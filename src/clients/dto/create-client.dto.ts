import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the client',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF in format XXX.XXX.XXX-XX',
  })
  @IsString()
  @Matches(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    { message: 'CPF must be in the format XXX.XXX.XXX-XX' },
  )
  cpf: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date in YYYY-MM-DD format',
  })
  @IsDateString({}, { message: 'Birth date must be a valid date in YYYY-MM-DD format' })
  birth_date: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Phone number in format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  @IsString()
  @Matches(
    /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
    { message: 'Phone must be in the format (XX) XXXX-XXXX or (XX) XXXXX-XXXX' },
  )
  phone: string;
}