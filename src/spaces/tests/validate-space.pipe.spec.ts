import { SpaceValidationPipe } from '../../pipes/validate-space.pipe';
import { BadRequestException } from '@nestjs/common';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { StatusEnum } from '../../enums/status.enum';

describe('SpaceValidationPipe', () => {
  let pipe: SpaceValidationPipe;

  beforeEach(() => {
    pipe = new SpaceValidationPipe(prismaMock as any);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});