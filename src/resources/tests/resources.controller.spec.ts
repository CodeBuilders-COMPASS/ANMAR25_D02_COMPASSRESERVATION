import { Test } from '@nestjs/testing';
import { ResourceController } from '../resources.controller';
import { ResourceService } from '../resources.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceExistsPipe } from '../../pipes/resource-exists.pipe';
import { prismaMock } from '../../__mocks__/prisma.mock';


describe('SpacesController', () => {
  let controller: ResourceController;
  let service: ResourceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ResourceController],
      providers: [
        ResourceService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: ResourceExistsPipe,
          useFactory: (prisma: PrismaService) => new ResourceExistsPipe(prisma),
          inject: [PrismaService],
        },
      ],
    }).compile();

    controller = moduleRef.get<ResourceController>(ResourceController);
    service = moduleRef.get<ResourceService>(ResourceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});