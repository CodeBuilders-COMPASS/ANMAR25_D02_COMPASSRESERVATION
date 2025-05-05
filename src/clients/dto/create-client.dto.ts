import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  Matches,
  Length,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @IsString()
  @Matches(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    { message: 'CPF must be in the format XXX.XXX.XXX-XX' },
  )
  cpf: string;

  @IsDateString({}, { message: 'Birth date must be a valid date in YYYY-MM-DD format' })
  birth_date: Date;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @Matches(
    /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
    { message: 'Phone must be in the format (XX) XXXX-XXXX or (XX) XXXXX-XXXX' },
  )
  phone: string;
}
