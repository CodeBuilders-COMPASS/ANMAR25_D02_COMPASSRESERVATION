import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }


  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return {
      access_token: token,
    };
  }
}

