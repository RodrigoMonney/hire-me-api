import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/services/prisma/prisma.service';

@Module({
  providers: [PrismaService],
})
export class SharedModule {}
