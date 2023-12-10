import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import recaptchaConfig from './recaptcha.config';
import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [recaptchaConfig],
    }),
  ],
  providers: [RecaptchaService],
  exports: [RecaptchaService],
})
export class RecaptchaModule {}
