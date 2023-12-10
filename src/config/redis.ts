import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  db: process.env.REDIS_DB || '0',
  prefix: 'nest_',
  ttl: 60 * 60 * 24 * 10 * 1000, // 10 days in milliseconds
}));
