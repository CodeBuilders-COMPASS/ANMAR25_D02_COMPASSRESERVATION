import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';  // Adicione esta linha
import { UserExistsPipe } from '../../pipes/user-exists.pipe'; // Se necessário

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsers = [
    { id: 1, name: 'João' },
    { id: 2, name: 'Maria' },
  ];

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue(mockUsers),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        PrismaService,  // Adicione o PrismaService como provider
        UserExistsPipe, // Se o UserExistsPipe for necessário, adicione aqui
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const query = {}; // ou adicione filtros para testar lógica do where
    const result = await controller.findAll(query);

    expect(result).toEqual(mockUsers);
    expect(usersService.findAll).toHaveBeenCalledWith(query);
  });
});
