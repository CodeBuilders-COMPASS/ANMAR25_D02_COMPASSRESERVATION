import { UserExistsPipe } from '../../pipes/user-exists.pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserExistsPipe', () => {
  let pipe: UserExistsPipe;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserExistsPipe,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    pipe = module.get<UserExistsPipe>(UserExistsPipe);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return the user id if user exists', async () => {
      const userId = 1;
      prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: userId });

      const result = await pipe.transform(userId);

      expect(result).toBe(userId);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 99;
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(pipe.transform(userId)).rejects.toThrow(NotFoundException);
      await expect(pipe.transform(userId)).rejects.toThrowError('User not found');
    });
  });
});
