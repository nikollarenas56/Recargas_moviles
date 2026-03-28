import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            validateCredentials: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data with valid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      jest.spyOn(usersService, 'validateCredentials').mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'password123',
      });

      const result = await service.login(loginDto);

      expect(usersService.validateCredentials).toHaveBeenCalledWith(
        'testuser',
        'password123',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
      });
      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: 1,
          username: 'testuser',
        },
      });
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      jest.spyOn(usersService, 'validateCredentials').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
