import { Module } from '@nestjs/common';
import { CacheService } from './infrastructure/services/cache/cache.service';
import { PrismaService } from './infrastructure/services/prisma/prisma.service';

@Module({
  providers: [PrismaService, CacheService],
  exports: [PrismaService, CacheService],
})
export class SharedModule {}
