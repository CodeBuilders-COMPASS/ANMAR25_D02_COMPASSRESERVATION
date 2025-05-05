import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PhoneValidationPipe implements PipeTransform {
  transform(value: any) {
    const { phone } = value;
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    if (!regex.test(phone)) {
      throw new BadRequestException('Invalid phone format');
    }

    return value;
  }
}
