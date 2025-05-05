import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: number): number {
    if (typeof value !== 'number' || isNaN(value) || value <= 0 || !Number.isInteger(value)) { 
      throw new BadRequestException('The value must be a positive integer.');
    }
    return value;
  }
}
