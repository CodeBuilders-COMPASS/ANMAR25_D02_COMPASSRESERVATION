import { Test } from '@nestjs/testing';
import { ResourceExistsPipe } from '../../pipes/resource-exists.pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { NotFoundException } from '@nestjs/common';

describe('ResourceExistsPipe', () => {
  let pipe: ResourceExistsPipe;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResourceExistsPipe,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    pipe = moduleRef.get<ResourceExistsPipe>(ResourceExistsPipe);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return id if resource exists', async () => {
    const testId = 1;
    prismaMock.resource.findUnique.mockResolvedValue({ id: testId } as any);
    
    const result = await pipe.transform(testId);
    expect(result).toBe(testId);
  });

  it('should throw NotFoundException if resource does not exist', async () => {
    prismaMock.resource.findUnique.mockResolvedValue(null);
    
    await expect(pipe.transform(999)).rejects.toThrow(NotFoundException);
  });
});