import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import AuthService from '../../application/auth.service';
import { AuthenticatedUser } from '../../domain/types/authenticated-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.authService.validateUser({ email, password });

    console.log('user from LocalStrategy.validate: ', user);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
