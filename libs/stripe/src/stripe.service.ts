import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;
  public constructor(private _config: ConfigService) {
    this.stripe = new Stripe(this._config.get('stripe').apiKey, {
      apiVersion: '2022-11-15',
    });
  }
}
