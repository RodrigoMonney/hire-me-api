import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/application/users.service';
import { CreateUserDto } from 'src/modules/users/web/dto/create-user.dto';
import { Role } from '../domain/enums/role.enum';
import { AuthenticatedUser } from '../domain/types/authenticated-user';
import { AuthResponseDto } from '../web/dto/auth-response.dto';
import UserLoginDto from '../web/dto/user-login.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: UserLoginDto): Promise<AuthenticatedUser | null> {
    const { email, password } = user;

    const foundUser = await this.usersService.findUserByEmail(email);

    if (!foundUser) return null;

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) return null;

    return {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role as Role,
    };
  }

  async login(user: AuthenticatedUser) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      acess_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateUserDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findUserById(data.email);

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
      role: data.role ?? Role.USER,
    });

    const jwtPayload = { sub: user.id, email: user.email, role: user.role };

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as Role,
      },
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
