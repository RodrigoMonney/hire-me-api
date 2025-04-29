import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [PrismaUserRepository],
})
export class UsersModule {}
