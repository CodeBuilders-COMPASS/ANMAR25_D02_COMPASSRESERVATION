import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let config: ConfigService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const configMock = {
    get: jest.fn().mockReturnValue('mocksecret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', '123456');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return null if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('unknown@example.com', '123456');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access_token', async () => {
      const signedToken = 'mocked.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(signedToken);

      const result = await service.login({ id: 1, email: 'test@example.com' });

      expect(configMock.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(result).toEqual({ access_token: signedToken });
    });

    it('should throw error if JWT_SECRET is not defined', async () => {
      (configMock.get as jest.Mock).mockReturnValue(undefined);

      await expect(service.login({ id: 1, email: 'test@example.com' })).rejects.toThrow(
        'JWT_SECRET is not defined in the environment variables',
      );
    });
  });
});
