import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CpfValidationPipe implements PipeTransform {
  transform(value: any) {
    const { cpf } = value;
    if (!cpf) {
      throw new BadRequestException('CPF is required');
    }

    const isValid = this.validateCPF(cpf);
    if (!isValid) {
      throw new BadRequestException('Invalid CPF');
    }

    return value;
  }

  private validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calc = (factor: number) => {
      let sum = 0;
      for (let i = 0; i < factor - 1; i++) {
        sum += parseInt(cpf.charAt(i)) * (factor - i);
      }
      let mod = (sum * 10) % 11;
      return mod === 10 ? 0 : mod;
    };

    const digit1 = calc(10);
    const digit2 = calc(11);

    return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
  }
}
