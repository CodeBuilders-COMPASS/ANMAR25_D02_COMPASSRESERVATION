import {
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  IsDateString,
} from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF must be in the format XXX.XXX.XXX-XX (e.g. 123.456.789-00)',
  })
  cpf?: string;

  @IsOptional()
  @IsDateString({}, {
    message: 'Birth date must be a valid ISO date string (e.g. 1990-12-31)',
  })
  birth_date?: string;

  @IsOptional()
  @IsEmail({}, {
    message: 'Email must be a valid email address (e.g. user@example.com)',
  })
  email?: string;

  @IsOptional()
  @Matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, {
    message: 'Phone must be in the format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  phone?: string;
}
