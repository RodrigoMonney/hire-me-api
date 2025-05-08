import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from 'src/modules/users/web/dto/create-user.dto';
import AuthService from '../application/auth.service';
import { AuthenticatedUser } from '../domain/types/authenticated-user';
import { PublicRoute } from './decorators/public-route.decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @PublicRoute()
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.authService.login(user);
  }

  @Post('register')
  @PublicRoute()
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
