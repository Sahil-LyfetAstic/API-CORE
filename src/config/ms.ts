import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

/* Micro service config */
export default registerAs('ms', () => ({
  transport: Transport.REDIS,
  options: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    retryAttempts: 5,
    retryDelay: 3000,
  },
}));
