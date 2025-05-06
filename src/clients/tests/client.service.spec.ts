import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { FilterClientDto } from '../dto/filter-client.dto';
import { StatusEnum } from '../../enums/status.enum';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('ClientService', () => {
  let service: ClientService;
  let prisma: PrismaService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new client with updated_at as null', async () => {
      const createDto: CreateClientDto = {
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: '1990-01-01',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
      };

      const expectedResult = {
        id: 1,
        ...createDto,
        birth_date: new Date(createDto.birth_date),
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: null,
      };

      prismaMock.client.findUnique.mockResolvedValue(null);
      prismaMock.client.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { email: createDto.email } });
      expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { cpf: createDto.cpf } });
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          birth_date: new Date(createDto.birth_date),
          status: StatusEnum.ACTIVE,
          updated_at: null,
        },
      });
    });

    it('should throw BadRequestException if email exists', async () => {
      const createDto: CreateClientDto = {
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: '1990-01-01',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
      };

      prismaMock.client.findUnique.mockResolvedValueOnce({ email: createDto.email });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if CPF exists', async () => {
      const createDto: CreateClientDto = {
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: '1990-01-01',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
      };

      prismaMock.client.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ cpf: createDto.cpf });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const createDto: CreateClientDto = {
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: '1990-01-01',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
      };

      prismaMock.client.findUnique.mockRejectedValue(new Error('Unexpected error'));

      await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a client with current timestamp', async () => {
      const updateDto: UpdateClientDto = { name: 'John Updated' };
      const expectedResult = {
        id: 1,
        name: 'John Updated',
        cpf: '123.456.789-00',
        birth_date: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '(11) 99999-9999',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prismaMock.client.update.mockResolvedValue(expectedResult);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(expectedResult);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateDto,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should handle birth_date conversion', async () => {
      const updateDto: UpdateClientDto = { birth_date: '1990-01-01' };
      const expectedResult = {
        id: 1,
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '(11) 99999-9999',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prismaMock.client.update.mockResolvedValue(expectedResult);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(expectedResult);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          birth_date: updateDto.birth_date ? new Date(updateDto.birth_date) : undefined,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const updateDto: UpdateClientDto = { name: 'John Updated' };
      prismaMock.client.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const updateDto: UpdateClientDto = { name: 'John Updated' };
      prismaMock.client.update.mockRejectedValue(new Error('Unexpected error'));

      await expect(service.update(1, updateDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return paginated clients with filters', async () => {
      const filterDto: FilterClientDto = { page: 1, limit: 10, name: 'John' };
      const mockClients = [{
        id: 1,
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '(11) 99999-9999',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      }];

      const expectedResult = {
        data: mockClients,
        meta: { total: 1, page: 1, pages: 1 },
      };

      prismaMock.client.findMany.mockResolvedValue(mockClients);
      prismaMock.client.count.mockResolvedValue(1);

      const result = await service.findAll(filterDto);
      expect(result).toEqual(expectedResult);
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'John' } },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('should return a client by id', async () => {
      const expectedResult = {
        id: 1,
        name: 'John Doe',
        cpf: '123.456.789-00',
        birth_date: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '(11) 99999-9999',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prismaMock.client.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findById(1);
      expect(result).toEqual(expectedResult);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if client not found', async () => {
      prismaMock.client.findUnique.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a client', async () => {
      const client = {
        id: 1,
        name: 'John Doe',
        status: StatusEnum.ACTIVE,
        reservations: [],
      };

      const expectedResult = {
        ...client,
        status: StatusEnum.INACTIVE,
        updated_at: new Date(),
      };

      prismaMock.client.findUnique.mockResolvedValue(client);
      prismaMock.client.update.mockResolvedValue(expectedResult);

      const result = await service.deactivate(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if client not found', async () => {
      prismaMock.client.findUnique.mockResolvedValue(null);
      await expect(service.deactivate(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if client has active reservations', async () => {
      const client = {
        id: 1,
        name: 'John Doe',
        status: StatusEnum.ACTIVE,
        reservations: [{ id: 1, status: 'OPEN' }],
      };

      prismaMock.client.findUnique.mockResolvedValue(client);
      await expect(service.deactivate(1)).rejects.toThrow(BadRequestException);
    });
  });
});