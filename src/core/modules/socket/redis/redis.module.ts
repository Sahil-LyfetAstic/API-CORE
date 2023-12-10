import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { redisProviders } from './redis.providers';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [...redisProviders, RedisService],
  exports: [...redisProviders, RedisService],
})
export class RedisModule {}
