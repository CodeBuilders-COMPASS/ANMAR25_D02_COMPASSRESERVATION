import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from '../reservations.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { FilterReservationDto } from '../dto/filter-reservation.dto';
import { StatusEnum } from 'src/enums/status.enum';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { prismaMock, PrismaMock } from '../../__mocks__/prisma.mock';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation and update resource quantities', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const createReservationDto: CreateReservationDto = {
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        resources: [{ resource_id: 1, quantity: 2 }],
      };

      const mockReservation = {
        id: 1,
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: startDate,
        end_date: endDate,
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        reservationResources: [],
      };

      prisma.reservation.create.mockResolvedValue(mockReservation);
      prisma.resource.update.mockResolvedValue({});

      const result = await service.create(createReservationDto);

      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: {
          client_id: createReservationDto.client_id,
          user_id: createReservationDto.user_id,
          space_id: createReservationDto.space_id,
          start_date: new Date(createReservationDto.start_date),
          end_date: new Date(createReservationDto.end_date),
          updated_at: null,
          status: ReservationStatus.OPEN,
          reservationResources: {
            create: createReservationDto.resources.map(r => ({
              resource_id: r.resource_id,
              quantity: r.quantity,
            })),
          },
        },
      });

      expect(prisma.resource.update).toHaveBeenCalledWith({
        where: { id: createReservationDto.resources[0].resource_id },
        data: {
          quantity: {
            decrement: createReservationDto.resources[0].quantity,
          },
        },
      });

      expect(result).toEqual(mockReservation);
    });
  });

  describe('findAll', () => {
    it('should return all reservations with pagination and filters', async () => {
      const filterDto: FilterReservationDto = {
        cpf: '12345678900',
        status: ReservationStatus.OPEN,
        page: 1,
        limit: 10,
      };

      const mockClient = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678900',
        phone: '123456789',
        email: 'john@example.com',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockSpace = {
        id: 1,
        name: 'Space 1',
        capacity: 10,
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockReservationResource = {
        reservation_id: 1,
        resource_id: 1,
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockResource = {
        id: 1,
        name: 'Resource 1',
        quantity: 5,
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockReservations = [
        {
          id: 1,
          client_id: 1,
          user_id: 1,
          space_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          updated_at: null,
          status: ReservationStatus.OPEN,
          client: mockClient,
          space: mockSpace,
          reservationResources: [
            {
              reservation_id: mockReservationResource.reservation_id,
              resourceId: mockReservationResource.resource_id,
              quantity: mockReservationResource.quantity,
              resource: mockResource,
            },
          ],
        },
        {
          id: 2,
          client_id: 1,
          user_id: 1,
          space_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          updated_at: null,
          status: ReservationStatus.OPEN,
          client: mockClient,
          space: mockSpace,
          reservationResources: [
            {
              reservation_id: mockReservationResource.reservation_id,
              resourceId: mockReservationResource.resource_id,
              quantity: mockReservationResource.quantity,
              resource: mockResource,
            },
          ],
        },
      ];

      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.reservation.count.mockResolvedValue(mockReservations.length);
      prisma.reservation.findMany.mockResolvedValue(mockReservations);

      const result = await service.findAll(filterDto);

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { cpf: filterDto.cpf },
        select: { id: true },
      });
      expect(prisma.reservation.count).toHaveBeenCalledWith({
        where: { client_id: 1, status: filterDto.status },
      });
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: { client_id: 1, status: filterDto.status },
        skip: (filterDto.page! - 1) * filterDto.limit!,
        take: filterDto.limit,
        include: {
          client: true,
          space: true,
          reservationResources: {
            include: {
              resource: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual({
        count: mockReservations.length,
        pages: Math.ceil(mockReservations.length / filterDto.limit!),
        data: mockReservations,
      });
    });

    it('should return reservations without CPF filter', async () => {
      const filterDto: FilterReservationDto = {
        status: ReservationStatus.OPEN,
        page: 1,
        limit: 10,
      };

      const mockClient = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678900',
        phone: '123456789',
        email: 'john@example.com',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockSpace = {
        id: 1,
        name: 'Space 1',
        capacity: 10,
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockReservationResource = {
        reservation_id: 1,
        resource_id: 1,
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockResource = {
        id: 1,
        name: 'Resource 1',
        quantity: 5,
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockReservations = [
        {
          id: 1,
          client_id: 1,
          user_id: 1,
          space_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          updated_at: null,
          status: ReservationStatus.OPEN,
          client: mockClient,
          space: mockSpace,
          reservationResources: [
            {
              reservation_id: mockReservationResource.reservation_id,
              resourceId: mockReservationResource.resource_id,
              quantity: mockReservationResource.quantity,
              resource: mockResource,
            },
          ],
        },
        {
          id: 2,
          client_id: 2,
          user_id: 1,
          space_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          updated_at: null,
          status: ReservationStatus.OPEN,
          client: mockClient,
          space: mockSpace,
          reservationResources: [
            {
              reservation_id: mockReservationResource.reservation_id,
              resourceId: mockReservationResource.resource_id,
              quantity: mockReservationResource.quantity,
              resource: mockResource,
            },
          ],
        },
      ];

      prisma.reservation.count.mockResolvedValue(mockReservations.length);
      prisma.reservation.findMany.mockResolvedValue(mockReservations);

      const result = await service.findAll(filterDto);

      expect(prisma.client.findUnique).not.toHaveBeenCalled();
      expect(prisma.reservation.count).toHaveBeenCalledWith({
        where: { status: filterDto.status },
      });
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: { status: filterDto.status },
        skip: (filterDto.page! - 1) * filterDto.limit!,
        take: filterDto.limit,
        include: {
          client: true,
          space: true,
          reservationResources: {
            include: {
              resource: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual({
        count: mockReservations.length,
        pages: Math.ceil(mockReservations.length / filterDto.limit!),
        data: mockReservations,
      });
    });

    it('should throw NotFoundException if client CPF is not found', async () => {
      const filterDto: FilterReservationDto = {
        cpf: '12345678900',
        status: ReservationStatus.OPEN,
        page: 1,
        limit: 10,
      };

      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findAll(filterDto)).rejects.toThrowError(
        NotFoundException,
      );
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { cpf: filterDto.cpf },
        select: { id: true },
      });
      expect(prisma.reservation.count).not.toHaveBeenCalled();
      expect(prisma.reservation.findMany).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a reservation with the given ID and related data', async () => {
      const reservationId = 1;
      const startDate = new Date();
      const endDate = new Date();
      const mockReservation = {
        id: reservationId,
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: startDate,
        end_date: endDate,
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        reservationResources: [{ reservation_id: 1, resourceId: 1, quantity: 2, resource: {id:1, name: 'Resource 1', quantity: 10, status: StatusEnum.ACTIVE, created_at: new Date(), updated_at: null} }],
      };
      const mockClient = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678900',
        phone: '123456789',
        email: 'john@example.com',
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockSpace = {
        id: 1,
        name: 'Space 1',
        capacity: 10,
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockReservationResource = {
        reservation_id: 1,
        resource_id: 1,
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockResource = {
        id: 1,
        name: 'Resource 1',
        quantity: 5,
        status: StatusEnum.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockFullReservation = {
        ...mockReservation,
        client: mockClient,
        space: mockSpace,
        reservationResources: [
          {
            reservation_id: mockReservationResource.reservation_id,
            resourceId: mockReservationResource.resource_id,
            quantity: mockReservationResource.quantity,
            resource: mockResource,
          },
        ],
      };

      prisma.reservation.findUnique.mockResolvedValue(mockFullReservation);

      const result = await service.findOne(reservationId);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: reservationId },
        include: {
          client: true,
          space: true,
          reservationResources: {
            include: { resource: true },
          },
        },
      });
      expect(result).toEqual(mockFullReservation);
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      const reservationId = 1;
      const updateReservationDto: UpdateReservationDto = {
        client_id: 2,
        space_id: 2,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        status: ReservationStatus.APPROVED,
        resources: [{ resource_id: 2, quantity: 3 }],
      };

      const existingReservation = {
        id: reservationId,
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        reservationResources: [
          {
            reservation_id: reservationId,
            resource_id: 1,
            quantity: 2,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };

      const updatedReservation = {
        ...existingReservation,
        client_id: updateReservationDto.client_id,
        space_id: updateReservationDto.space_id,
        start_date: new Date(updateReservationDto.start_date!),
        end_date: new Date(updateReservationDto.end_date!),
        status: updateReservationDto.status,
        updated_at: new Date(),
        reservationResources: updateReservationDto.resources?.map(r => ({
          reservation_id: reservationId,
          resourceId: r.resource_id,
          quantity: r.quantity,
          resource: {id: r.resource_id, name: 'Resource 2', quantity: 8, status: StatusEnum.ACTIVE, created_at: new Date(), updated_at: null}
        })) || [],
      };

      prisma.reservation.findUnique.mockResolvedValue(existingReservation);
      prisma.reservationResource.deleteMany.mockResolvedValue({ count: 1 });
      prisma.reservationResource.createMany.mockResolvedValue({ count: updateReservationDto.resources!.length });
      prisma.reservation.update.mockResolvedValue(updatedReservation);

      const result = await service.update(reservationId, updateReservationDto);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: reservationId },
        include: { reservationResources: true },
      });
      expect(prisma.reservationResource.deleteMany).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
      });
      expect(prisma.reservationResource.createMany).toHaveBeenCalledWith({
        data: updateReservationDto.resources!.map(r => ({
          reservation_id: reservationId,
          resource_id: r.resource_id,
          quantity: r.quantity,
        })),
      });
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id: reservationId },
        data: {
          client_id: updateReservationDto.client_id,
          space_id: updateReservationDto.space_id,
          start_date: new Date(updateReservationDto.start_date!),
          end_date: new Date(updateReservationDto.end_date!),
          status: updateReservationDto.status,
          updated_at: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedReservation);
    });

    it('should throw NotFoundException if reservation to update does not exist', async () => {
      const reservationId = 1;
      const updateReservationDto: UpdateReservationDto = { client_id: 2, space_id: 2 };

      prisma.reservation.findUnique.mockResolvedValue(null);

      await expect(service.update(reservationId, updateReservationDto)).rejects.toThrowError(NotFoundException);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: reservationId },
        include: { reservationResources: true },
      });
      expect(prisma.reservation.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if reservation status is not OPEN', async () => {
      const reservationId = 1;
      const updateReservationDto = { client_id: 2, space_id: 2 };
      const existingReservation = {
        id: reservationId,
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.APPROVED,
        reservationResources: [],
      };

      prisma.reservation.findUnique.mockResolvedValue(existingReservation);
      prisma.reservation.update.mockRejectedValue(new BadRequestException());

      await expect(service.update(reservationId, updateReservationDto)).rejects.toThrowError(BadRequestException);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: reservationId },
        include: { reservationResources: true },
      });
      expect(prisma.reservation.update).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      const reservationId = 1;
      const existingReservation = {
        id: reservationId,
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        reservationResources: [],
      };
      const cancelledReservation = {
        ...existingReservation,
        status: ReservationStatus.CANCELLED,
        updated_at: new Date(),
      };

      prisma.reservation.findUnique.mockResolvedValue(existingReservation);
      prisma.reservation.update.mockResolvedValue(cancelledReservation);

      const result = await service.cancel(reservationId);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({ where: { id: reservationId } });
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id: reservationId },
        data: { status: ReservationStatus.CANCELLED, updated_at: expect.any(Date) },
      });
      expect(result).toEqual(cancelledReservation);
    });

    it('should throw NotFoundException if reservation to cancel does not exist', async () => {
      const reservationId = 1;
      prisma.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancel(reservationId)).rejects.toThrowError(NotFoundException);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({ where: { id: reservationId } });
      expect(prisma.reservation.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if reservation status is not OPEN', async () => {
      const reservationId = 1;
      const existingReservation = {
        id: reservationId,
        client_id: 1,
        user_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.CANCELLED,
        reservationResources: [],
      };

      prisma.reservation.findUnique.mockResolvedValue(existingReservation);

      await expect(service.cancel(reservationId)).rejects.toThrowError(BadRequestException);

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({ where: { id: reservationId } });
      expect(prisma.reservation.update).not.toHaveBeenCalled();
    });
  });
});

