import {
    IsString,
    IsEmail,
    IsOptional,
    Matches,
    IsDateString,
  } from 'class-validator';
  
  export class UpdateClientDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'Invalid CPF format' })
    cpf?: string;
  
    @IsOptional()
    @IsDateString({}, { message: 'Invalid birth date' })
    birth_date?: Date;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @Matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, { message: 'Invalid phone format' })
    phone?: string;
  }
  