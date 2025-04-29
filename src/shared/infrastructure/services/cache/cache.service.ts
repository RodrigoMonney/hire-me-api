import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly defaultTtl: number;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.defaultTtl = this.configService.get<number>('REDIS_TTL', 600);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.redis.get(key);
      console.log('CacheService.get result', result);

      if (!result) {
        return null;
      }

      return JSON.parse(result) as T;
    } catch (error) {
      console.error(`[CacheService] Error getting key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      const timeToLive = ttl ?? this.defaultTtl;

      if (timeToLive) {
        await this.redis.set(key, serialized, 'EX', timeToLive);
      } else {
        await this.redis.set(key, serialized);
      }

      console.log('CacheService.set result', { key, value, ttl: timeToLive });
    } catch (error) {
      console.error(`[CacheService] Error setting key "${key}":`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      console.log('CacheService.del result', key);
    } catch (error) {
      console.error(`[CacheService] Error deleting key "${key}":`, error);
    }
  }
}
