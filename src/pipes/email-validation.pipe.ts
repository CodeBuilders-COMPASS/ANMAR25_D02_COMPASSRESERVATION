import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: any) {
    const { email } = value;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    return value;
  }
}
