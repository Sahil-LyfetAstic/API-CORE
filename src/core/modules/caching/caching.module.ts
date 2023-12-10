import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import redisConfig from '../../../config/redis';
import { CachingService } from './caching.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [redisConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        ...config.get('redis'),
      }),
      isGlobal: true,
    }),
  ],
  exports: [CachingService],
  providers: [CachingService],
})
export class CachingModule {}
