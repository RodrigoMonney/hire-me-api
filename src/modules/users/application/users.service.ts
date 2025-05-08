import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../../shared/infrastructure/services/cache/cache.service';
import { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { CreateUserDto } from '../web/dto/create-user.dto';
import { GetUserDto } from '../web/dto/get-user.dto';
import { UpdateUserDto } from '../web/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    private readonly cacheService: CacheService,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.create(data);

    await this.cacheService.del('users:all');

    return user;
  }

  async findAllUsers(): Promise<GetUserDto[]> {
    const cached = await this.cacheService.get<GetUserDto[]>('users:all');

    if (cached) return cached;

    const usersDb = await this.userRepository.findAll();

    const users = usersDb.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    await this.cacheService.set('users:all', users);

    return users;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    const cacheKey = `users:${id}`;
    const cached = await this.cacheService.get<UserEntity>(cacheKey);

    if (cached) return cached;

    const user = await this.userRepository.findById(id);

    if (!user) return null;

    await this.cacheService.set(cacheKey, user);

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.update(id, data);

    await this.cacheService.del('users:all');
    await this.cacheService.del(`users:${id}`);

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.delete(id);

    await this.cacheService.del('users:all');
    await this.cacheService.del(`users:${id}`);
  }
}
