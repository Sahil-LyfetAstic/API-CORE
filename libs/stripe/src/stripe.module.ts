import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import stripeConfig from './stripe.config';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [stripeConfig],
    }),
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
