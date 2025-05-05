import { PositiveIntPipe } from '../src/pipes/positive-int.pipe';
import { BadRequestException } from '@nestjs/common';

describe('PositiveIntPipe', () => {
  let pipe: PositiveIntPipe;

  beforeEach(() => {
    pipe = new PositiveIntPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform valid positive integer to number', () => { // Alterado para receber number
    expect(pipe.transform(42)).toBe(42);
  });

  it('should throw BadRequestException for non-positive integers', () => {
    expect(() => pipe.transform(0)).toThrowError(BadRequestException);
    expect(() => pipe.transform(-1)).toThrowError(BadRequestException);
    expect(() => pipe.transform(NaN)).toThrowError(BadRequestException); // Adicionado teste para NaN
    expect(() => pipe.transform(1.5)).toThrowError(BadRequestException);
  });
});