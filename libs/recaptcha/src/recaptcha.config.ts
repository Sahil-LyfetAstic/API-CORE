import { registerAs } from '@nestjs/config';

export default registerAs('recaptcha', () => ({
  secret: process.env.RECAPTCHA_SECRET_KET,
}));
