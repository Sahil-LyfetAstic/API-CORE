import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

export type RedisClient = Redis;

export const redisProviders: Provider[] = [
  {
    inject: [ConfigService],
    useFactory: (config: ConfigService): RedisClient => {
      return new Redis(config.get('redis'));
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    inject: [ConfigService],
    useFactory: (config: ConfigService): RedisClient => {
      return new Redis(config.get('redis'));
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
