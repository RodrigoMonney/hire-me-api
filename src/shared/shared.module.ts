import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/services/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
