import { PositiveIntPipe } from '../../pipes/positive-int.pipe';
import { BadRequestException } from '@nestjs/common';

describe('PositiveIntPipe', () => {
  let pipe: PositiveIntPipe;

  beforeEach(() => {
    pipe = new PositiveIntPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform valid positive integer string to number', () => {
    expect(pipe.transform('42')).toBe(42);
  });
});