import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'The email of the user',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'The password of the user',
    required: true,
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token for authenticated requests',
  })
  access_token: string;
}