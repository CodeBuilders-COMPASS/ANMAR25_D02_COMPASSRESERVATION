import { Test } from '@nestjs/testing';
import { ResourceService } from '../resources.service';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { StatusEnum } from '../../enums/status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ResourceService', () => {
  let service: ResourceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = moduleRef.get<ResourceService>(ResourceService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a resource', async () => {
      const dto = {
        name: 'Test Resource',
        description: 'Test Description',
        quantity: 10,
      };

      prismaMock.resource.findUnique.mockResolvedValue(null);
      prismaMock.resource.create.mockResolvedValue({
        ...dto,
        id: 1,
        status: StatusEnum.ACTIVE,
      });

      const result = await service.create(dto);
      expect(result).toEqual({
        ...dto,
        id: 1,
        status: StatusEnum.ACTIVE,
      });
    });

    it('should throw BadRequestException if name exists', async () => {
      const dto = {
        name: 'Existing Resource',
        description: 'Test Description',
        quantity: 10,
      };

      prismaMock.resource.findUnique.mockResolvedValue({
        ...dto,
        id: 1,
        status: StatusEnum.ACTIVE,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated resources with filters', async () => {
      const filterDto = {
        name: 'Test',
        page: 1,
        limit: 10,
      };

      const mockResources = [
        { id: 1, name: 'Test Resource 1', quantity: 10, status: StatusEnum.ACTIVE },
        { id: 2, name: 'Test Resource 2', quantity: 20, status: StatusEnum.ACTIVE },
      ];

      prismaMock.resource.count.mockResolvedValue(2);
      prismaMock.resource.findMany.mockResolvedValue(mockResources);

      const result = await service.findAll(filterDto);
      expect(result).toEqual({
        count: 2,
        pages: 1,
        data: mockResources,
      });
    });
  });

  describe('findOne', () => {
    it('should return a resource', async () => {
      const mockResource = {
        id: 1,
        name: 'Test Resource',
        quantity: 10,
        status: StatusEnum.ACTIVE,
      };

      prismaMock.resource.findUnique.mockResolvedValue(mockResource);

      const result = await service.findOne(1);
      expect(result).toEqual(mockResource);
    });

    it('should throw NotFoundException if resource does not exist', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const existingResource = {
        id: 1,
        name: 'Old Name',
        quantity: 10,
        status: StatusEnum.ACTIVE,
      };

      const updateDto = {
        name: 'New Name',
        quantity: 20,
      };

      prismaMock.resource.findUnique.mockResolvedValueOnce(existingResource);
      prismaMock.resource.findUnique.mockResolvedValueOnce(null);
      prismaMock.resource.update.mockResolvedValue({
        ...existingResource,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);
      expect(result).toEqual({
        ...existingResource,
        ...updateDto,
      });
    });

    it('should throw BadRequestException if name exists', async () => {
      const existingResource = {
        id: 1,
        name: 'Old Name',
        quantity: 10,
        status: StatusEnum.ACTIVE,
      };

      const updateDto = {
        name: 'Existing Name',
      };

      prismaMock.resource.findUnique.mockResolvedValueOnce(existingResource);
      prismaMock.resource.findUnique.mockResolvedValueOnce({
        id: 2,
        name: 'Existing Name',
      });

      await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should deactivate a resource', async () => {
      const existingResource = {
        id: 1,
        name: 'Test Resource',
        quantity: 10,
        status: StatusEnum.ACTIVE,
      };

      prismaMock.resource.findUnique.mockResolvedValue(existingResource);
      prismaMock.resource.update.mockResolvedValue({
        ...existingResource,
        status: StatusEnum.INACTIVE,
      });

      const result = await service.remove(1);
      expect(result.status).toBe(StatusEnum.INACTIVE);
    });
  });
});