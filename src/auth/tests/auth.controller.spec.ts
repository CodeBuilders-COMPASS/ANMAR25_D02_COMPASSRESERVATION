import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('should return access_token when credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const token = { access_token: 'jwt.token.here' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(token);

      const result = await controller.login({ email: 'test@example.com', password: '123456' });

      expect(mockAuthService.validateUser).toHaveBeenCalledWith('test@example.com', '123456');
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(token);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({ email: 'wrong@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});
