import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome API Reservation http://localhost:3000/api/v1/auth/login';
  }
}
