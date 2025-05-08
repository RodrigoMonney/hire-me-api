import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/modules/auth/web/decorators/public-route.decorator';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  // @UseGuards(AccessTokenGuard)
  @PublicRoute()
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  async findUserById(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
