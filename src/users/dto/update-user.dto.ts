import { IsOptional, IsEmail, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'Password must contain letters and numbers',
  })
  password?: string;

  @IsOptional()
  @Matches(/^\d{10,15}$/, { message: 'Invalid phone number' })
  phone?: string;
}
