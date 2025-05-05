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
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'Invalid CPF format' })
    cpf: string;
  
    @IsDateString({}, { message: 'Invalid birth date' })
    birth_date: Date;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @Matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, { message: 'Invalid phone format' })
    phone: string;
  }
  