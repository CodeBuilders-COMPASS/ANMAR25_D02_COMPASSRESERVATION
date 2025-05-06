import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { prismaMock } from '../../__mocks__/prisma.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a user successfully', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);
      prismaMock.user.create = jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        phone: '123456789',
      });

      const result = await service.create({
        email: 'test@example.com',
        password: '123',
        name: 'Test',
        phone: '123456789',
      });

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });

    it('should throw if email already exists', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue({ id: 1 });

      await expect(
        service.create({
          email: 'exists@example.com',
          password: '123',
          name: 'Test',
          phone: '123456789',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      prismaMock.user.findMany = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await service.findAll({});
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);
      expect(result).toHaveProperty('id');
    });

    it('should throw if user not found', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue({ id: 1 });
      prismaMock.user.update = jest.fn().mockResolvedValue({ id: 1, name: 'Updated' });

      const result = await service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw if user not found', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should set user status to INACTIVE', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue({ id: 1 });
      prismaMock.user.update = jest.fn().mockResolvedValue({ id: 1, status: 'INACTIVE' });

      const result = await service.remove(1);
      expect(result.status).toBe('INACTIVE');
    });

    it('should throw if user not found', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
