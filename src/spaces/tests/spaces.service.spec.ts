import { Test } from '@nestjs/testing';
import { SpacesService } from '../spaces.service';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { StatusEnum } from '../../enums/status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SpacesService', () => {
  let service: SpacesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SpacesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get<SpacesService>(SpacesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a space', async () => {
      const dto = {
        name: 'Test Space',
        description: 'Test Description',
        capacity: 10,
      };

      prismaMock.space.findUnique.mockResolvedValue(null);
      prismaMock.space.create.mockResolvedValue({
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
        name: 'Existing Space',
        description: 'Test Description',
        capacity: 10,
      };

      prismaMock.space.findUnique.mockResolvedValue({
        ...dto,
        id: 1,
        status: StatusEnum.ACTIVE,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated spaces with filters', async () => {
      const filterDto = {
        name: 'Test',
        page: 1,
        limit: 10,
      };

      const mockSpaces = [
        { id: 1, name: 'Test Space 1', capacity: 10, status: StatusEnum.ACTIVE },
        { id: 2, name: 'Test Space 2', capacity: 20, status: StatusEnum.ACTIVE },
      ];

      prismaMock.space.count.mockResolvedValue(2);
      prismaMock.space.findMany.mockResolvedValue(mockSpaces);

      const result = await service.findAll(filterDto);
      expect(result).toEqual({
        count: 2,
        pages: 1,
        data: mockSpaces,
      });
      expect(prismaMock.space.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Test' },
          capacity: undefined,
          status: undefined,
        },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a space', async () => {
      const mockSpace = {
        id: 1,
        name: 'Test Space',
        capacity: 10,
        status: StatusEnum.ACTIVE,
      };

      prismaMock.space.findUnique.mockResolvedValue(mockSpace);

      const result = await service.findOne(1);
      expect(result).toEqual(mockSpace);
    });

    it('should throw NotFoundException if space does not exist', async () => {
      prismaMock.space.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a space', async () => {
      const existingSpace = {
        id: 1,
        name: 'Old Name',
        capacity: 10,
        status: StatusEnum.ACTIVE,
      };

      const updateDto = {
        name: 'New Name',
        capacity: 20,
      };

      prismaMock.space.findUnique.mockResolvedValueOnce(existingSpace);
      prismaMock.space.findUnique.mockResolvedValueOnce(null);
      prismaMock.space.update.mockResolvedValue({
        ...existingSpace,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);
      expect(result).toEqual({
        ...existingSpace,
        ...updateDto,
      });
    });

    it('should throw BadRequestException if name exists', async () => {
      const existingSpace = {
        id: 1,
        name: 'Old Name',
        capacity: 10,
        status: StatusEnum.ACTIVE,
      };

      const updateDto = {
        name: 'Existing Name',
      };

      prismaMock.space.findUnique.mockResolvedValueOnce(existingSpace);
      prismaMock.space.findUnique.mockResolvedValueOnce({
        id: 2,
        name: 'Existing Name',
      });

      await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should deactivate a space', async () => {
      const existingSpace = {
        id: 1,
        name: 'Test Space',
        capacity: 10,
        status: StatusEnum.ACTIVE,
      };

      prismaMock.space.findUnique.mockResolvedValue(existingSpace);
      prismaMock.space.update.mockResolvedValue({
        ...existingSpace,
        status: StatusEnum.INACTIVE,
      });

      const result = await service.remove(1);
      expect(result.status).toBe(StatusEnum.INACTIVE);
    });
  });
});