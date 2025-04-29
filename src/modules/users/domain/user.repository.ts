import { CreateUserDto } from '../web/dto/create-user.dto';
import { UpdateUserDto } from '../web/dto/update-user.dto';
import { UserEntity } from './user.entity';

export interface UserRepository {
  create(data: CreateUserDto): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  update(id: string, data: UpdateUserDto): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
