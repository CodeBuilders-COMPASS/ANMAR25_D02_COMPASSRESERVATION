import { Test } from '@nestjs/testing';
import { SpacesController } from '../spaces.controller';
import { SpacesService } from '../spaces.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SpaceExistsPipe } from '../../pipes/space-exists.pipe';
import { prismaMock } from '../../__mocks__/prisma.mock';

describe('SpacesController', () => {
  let controller: SpacesController;
  let service: SpacesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: SpaceExistsPipe,
          useFactory: (prisma: PrismaService) => new SpaceExistsPipe(prisma),
          inject: [PrismaService],
        },
      ],
    }).compile();

    controller = moduleRef.get<SpacesController>(SpacesController);
    service = moduleRef.get<SpacesService>(SpacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});