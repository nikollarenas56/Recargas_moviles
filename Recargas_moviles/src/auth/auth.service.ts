import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

/**
 * Servicio de autenticación.
 *
 * Responsabilidades:
 * - Validar credenciales contra la fuente de usuarios.
 * - Emitir JWT con claims mínimos para identificar al usuario.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // La validación de credenciales se mantiene fuera del controlador
    // para preservar separación de responsabilidades.
    const user = await this.usersService.validateCredentials(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Claim "sub" sigue la convención JWT para el identificador principal.
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
