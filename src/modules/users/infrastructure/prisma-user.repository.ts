import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/services/prisma/prisma.service';
import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { CreateUserDto } from '../web/dto/create-user.dto';
import { UpdateUserDto } from '../web/dto/update-user.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    return await this.prisma.user.create({ data });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
