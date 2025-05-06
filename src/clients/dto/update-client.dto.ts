import {
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty({
    example: 'John Updated',
    description: 'Full name of the client',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF in format XXX.XXX.XXX-XX',
    required: false,
  })
  @IsOptional()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF must be in the format XXX.XXX.XXX-XX (e.g. 123.456.789-00)',
  })
  cpf?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date in YYYY-MM-DD format',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, {
    message: 'Birth date must be a valid ISO date string (e.g. 1990-12-31)',
  })
  birth_date?: string;

  @ApiProperty({
    example: 'updated@example.com',
    description: 'Valid email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, {
    message: 'Email must be a valid email address (e.g. user@example.com)',
  })
  email?: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Phone number in format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
    required: false,
  })
  @IsOptional()
  @Matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, {
    message: 'Phone must be in the format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  phone?: string;
}