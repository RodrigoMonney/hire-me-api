import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { CreateUserDto } from '../web/dto/create-user.dto';
import { UpdateUserDto } from '../web/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(data);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserEntity> {
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
