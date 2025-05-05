import { Test } from '@nestjs/testing';
import { ResourceValidationPipe } from '../../pipes/validate-resources.pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { BadRequestException } from '@nestjs/common';
import { StatusEnum } from '../../enums/status.enum';

describe('ResourceValidationPipe', () => {
  let pipe: ResourceValidationPipe;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResourceValidationPipe,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    pipe = moduleRef.get<ResourceValidationPipe>(ResourceValidationPipe);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return value if all resources are valid', async () => {
    const testValue = {
      resources: [
        { resource_id: 1, quantity: 5 },
        { resource_id: 2, quantity: 3 },
      ],
    };

    prismaMock.resource.findUnique.mockImplementation(({ where }) => {
      return Promise.resolve({
        id: where.id,
        name: `Resource ${where.id}`,
        quantity: 10,
        status: StatusEnum.ACTIVE,
      });
    });

    const result = await pipe.transform(testValue);
    expect(result).toEqual(testValue);
  });

  it('should throw BadRequestException for inactive resource', async () => {
    const testValue = {
      resources: [
        { resource_id: 1, quantity: 5 },
      ],
    };

    prismaMock.resource.findUnique.mockResolvedValue({
      id: 1,
      status: StatusEnum.INACTIVE,
    } as any);

    await expect(pipe.transform(testValue)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for insufficient quantity', async () => {
    const testValue = {
      resources: [
        { resource_id: 1, quantity: 15 },
      ],
    };

    prismaMock.resource.findUnique.mockResolvedValue({
      id: 1,
      quantity: 10,
      status: StatusEnum.ACTIVE,
    } as any);

    await expect(pipe.transform(testValue)).rejects.toThrow(BadRequestException);
  });
});