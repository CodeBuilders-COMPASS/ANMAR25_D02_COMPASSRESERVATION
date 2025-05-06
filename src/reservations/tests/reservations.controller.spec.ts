import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from '../reservations.controller';
import { ReservationService } from '../reservations.service';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { ReservationStatus } from '../../enums/reservationStatus.enum';
import { StatusEnum } from '../../enums/status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

type MockReservationService = {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  cancel: jest.Mock;
};

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: MockReservationService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            cancel: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    controller = moduleRef.get<ReservationController>(ReservationController);
    service = moduleRef.get<MockReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of the service and return 201 Created', async () => {
      const createReservationDto = {
        user_id: 1,
        client_id: 1,
        space_id: 1,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        resources: [],
      };
      const mockReservation = {
        id: 1,
        user_id: 1,
        client_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        closed_at: null,
      };

      service.create.mockResolvedValue(mockReservation);

      const response = await controller.create(createReservationDto);

      expect(service.create).toHaveBeenCalledWith(createReservationDto);
      expect(response).toEqual(mockReservation);
    });

    it('should handle errors from the service and return 400 Bad Request', async () => {
      const createReservationDto = {
        user_id: 1,
        client_id: 1,
        space_id: 1,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        resources: [],
      };
      service.create.mockRejectedValue(new HttpException('Invalid input', HttpStatus.BAD_REQUEST));

      try {
        await controller.create(createReservationDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the service and return 200 OK', async () => {
      const filterReservationDto = {};
      const mockReturnValue = {
        count: 0,
        pages: 0,
        data: [],
      };
      service.findAll.mockResolvedValue(mockReturnValue);

      const result = await controller.findAll(filterReservationDto);

      expect(service.findAll).toHaveBeenCalledWith(filterReservationDto);
      expect(result).toEqual(mockReturnValue);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service and return 200 OK', async () => {
      const id = 1;
      const mockReservation = {
        id: 1,
        user_id: 1,
        client_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        closed_at: null,
        space: {
          name: 'Space 1',
          id: 1,
          created_at: new Date(),
          updated_at: null,
          status: StatusEnum.ACTIVE,
          description: 'Description 1',
          capacity: 10,
        },
        client: {
          name: 'Client 1',
          id: 1,
          created_at: new Date(),
          updated_at: null,
          status: StatusEnum.ACTIVE,
          cpf: '123.456.789-00',
          birth_date: new Date(),
          email: 'client1@example.com',
          phone: '1234567890',
        },
        reservationResources: [],
      };
      service.findOne.mockResolvedValue(mockReservation);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockReservation);
    });

    it('should handle "not found" errors from the service and return 404 Not Found', async () => {
      const id = 1;
      service.findOne.mockRejectedValue(new HttpException('Reservation not found', HttpStatus.NOT_FOUND));

      try {
        await controller.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('update', () => {
    it('should call the update method of the service and return 200 OK', async () => {
      const id = 1;
      const updateReservationDto = { end_date: new Date().toISOString() };
      const mockReservation = {
        id: 1,
        user_id: 1,
        client_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: null,
        status: ReservationStatus.OPEN,
        closed_at: null,
      };
      service.update.mockResolvedValue(mockReservation);

      const result = await controller.update(id, updateReservationDto);

      expect(service.update).toHaveBeenCalledWith(id, updateReservationDto);
      expect(result).toEqual(mockReservation);
    });

    it('should handle errors from the service and return 400 Bad Request', async () => {
      const id = 1;
      const updateReservationDto = { end_date: new Date().toISOString() };
      service.update.mockRejectedValue(new HttpException('Update failed', HttpStatus.BAD_REQUEST));

      try {
        await controller.update(id, updateReservationDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('cancel', () => {
    it('should call the cancel method of the service and return 200 OK', async () => {
      const id = 1;
      const mockReservation = {
        id: 1,
        user_id: 1,
        client_id: 1,
        space_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        status: ReservationStatus.CANCELLED,
        closed_at: new Date(),
      };
      service.cancel.mockResolvedValue(mockReservation);

      const result = await controller.cancel(id);

      expect(service.cancel).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockReservation);
    });
  });
});
