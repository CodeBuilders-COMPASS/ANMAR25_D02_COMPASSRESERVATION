import { SpaceExistsPipe } from '../../pipes/space-exists.pipe';
import { NotFoundException } from '@nestjs/common';
import { prismaMock } from '../../__mocks__/prisma.mock';

describe('SpaceExistsPipe', () => {
  let pipe: SpaceExistsPipe;

  beforeEach(() => {
    pipe = new SpaceExistsPipe(prismaMock as any);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});