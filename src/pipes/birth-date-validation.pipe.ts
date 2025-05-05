import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BirthDateValidationPipe implements PipeTransform {
  transform(value: any) {
    const { birth_date } = value;
    if (!birth_date) {
      throw new BadRequestException('Birth date is required');
    }

    const date = new Date(birth_date);
    const now = new Date();

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid birth date');
    }

    if (date >= now) {
      throw new BadRequestException('Birth date must be in the past');
    }

    return value;
  }
}
