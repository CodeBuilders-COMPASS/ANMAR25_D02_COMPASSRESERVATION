import { Test } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { ClientService } from '../client.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SpaceExistsPipe } from '../../pipes/space-exists.pipe';
import { prismaMock } from '../../__mocks__/prisma.mock';

describe('SpacesController', () => {
  let controller: ClientController;
  let service: ClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        ClientService,
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

    controller = moduleRef.get<ClientController>(ClientController);
    service = moduleRef.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});