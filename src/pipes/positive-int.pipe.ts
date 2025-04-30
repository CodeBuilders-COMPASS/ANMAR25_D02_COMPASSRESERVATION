// src/pipes/positive-int.pipe.ts
import {
    PipeTransform,
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  
  @Injectable()
  export class PositiveIntPipe implements PipeTransform {
    transform(value: any) {
      const val = parseInt(value, 10);
  
      if (isNaN(val) || val <= 0) {
        throw new BadRequestException(
          'Você precisa inserir um inteiro e positivo.',
        );
      }
  
      return val;
    }
  }
  