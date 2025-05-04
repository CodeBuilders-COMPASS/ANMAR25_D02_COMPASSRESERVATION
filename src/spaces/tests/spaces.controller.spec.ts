import { Test } from '@nestjs/testing';
import { SpacesController } from '../spaces.controller';
import { SpacesService } from '../spaces.service';

describe('SpacesController', () => {
  let controller: SpacesController;
  let service: SpacesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        {
          provide: SpacesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<SpacesController>(SpacesController);
    service = moduleRef.get<SpacesService>(SpacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});