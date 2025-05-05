import { Test, TestingModule } from '@nestjs/testing';
import { ClientExistsPipe } from '../../pipes/client-exist.pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusEnum } from '../../enums/status.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ClientExistsPipe', () => {
  let pipe: ClientExistsPipe;
  let prisma: PrismaService;

  const mockPrismaService = {
    client: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientExistsPipe,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    pipe = module.get<ClientExistsPipe>(ClientExistsPipe);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return the same id if client exists and is active', async () => {
    const mockClient = {
      id: 1,
      status: StatusEnum.ACTIVE,
    };

    mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

    const result = await pipe.transform(1);
    expect(result).toBe(1);
    expect(prisma.client.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException if client does not exist', async () => {
    mockPrismaService.client.findUnique.mockResolvedValue(null);

    await expect(pipe.transform(1)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if client is inactive', async () => {
    const mockClient = {
      id: 1,
      status: StatusEnum.INACTIVE,
    };

    mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

    await expect(pipe.transform(1)).rejects.toThrow(BadRequestException);
  });
});