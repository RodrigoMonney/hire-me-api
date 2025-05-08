import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from './application/users.service';
import { USER_REPOSITORY } from './domain/user.repository';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { UsersController } from './web/users.controller';

@Module({
  imports: [SharedModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
