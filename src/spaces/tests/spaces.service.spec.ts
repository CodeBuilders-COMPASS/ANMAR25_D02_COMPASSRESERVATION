import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from '../spaces.service';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaMock } from '../../__mocks__/prisma.mock';

describe('SpacesService', () => {
  let service: SpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should return an array of spaces', async () => {
      const mockSpaces = [{ id: 1, name: 'Room A' }];
      const filterDto = {}; 
      prismaMock.space.findMany.mockResolvedValue(mockSpaces);
  
      const result = await service.findAll(filterDto);
      expect(result).toEqual(mockSpaces);
      expect(prismaMock.space.findMany).toHaveBeenCalled();
    });
  });  
});
