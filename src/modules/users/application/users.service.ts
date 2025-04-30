import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../../shared/infrastructure/services/cache/cache.service';
import { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { CreateUserDto } from '../web/dto/create-user.dto';
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

  async findAllUsers(): Promise<UserEntity[]> {
    const cached = await this.cacheService.get<UserEntity[]>('users:all');

    if (cached) return cached;

    const users = await this.userRepository.findAll();

    await this.cacheService.set('users:all', users);

    return users;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    const cacheKey = `users:${id}`;
    const cached = await this.cacheService.get<UserEntity>(cacheKey);

    if (cached) return cached;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.cacheService.set(cacheKey, user);

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
